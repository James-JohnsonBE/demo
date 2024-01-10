import { AuditOrganization } from "../entities/AuditOrganization.js";
import { AuditRequest } from "../entities/AuditRequest.js";
import { AuditBulkRequest } from "../entities/AuditBulkRequest.js";
import { SPList } from "../infrastructure/SAL.js";
import { AuditEmail } from "../entities/AuditEmail.js";
import { AuditRequestsInternal } from "../entities/AuditRequestsInternal.js";
import { AuditResponse } from "../entities/AuditResponse.js";
import { AuditResponseDoc } from "../entities/AuditResponseDocs.js";
import { AuditCoversheet } from "../entities/AuditCoversheet.js";

const DEBUG = false;

export class ApplicationDbContext {
  constructor() {}

  AuditBulkRequests = new EntitySet(AuditBulkRequest);

  AuditCoversheets = new EntitySet(AuditCoversheet);

  AuditEmails = new EntitySet(AuditEmail);

  AuditOrganizations = new EntitySet(AuditOrganization);

  AuditResponses = new EntitySet(AuditResponse);

  AuditResponseDocs = new EntitySet(AuditResponseDoc);

  AuditRequests = new EntitySet(AuditRequest);

  AuditRequestsInternals = new EntitySet(AuditRequestsInternal);

  virtualSets = new Map();

  Set = (entityType) => {
    const key = entityType.ListDef.name;

    // If we have a defined entityset, return that
    const set = Object.values(this)
      .filter((val) => val.constructor.name == EntitySet.name)
      .find((set) => set.ListDef?.name == key);
    if (set) return set;

    if (!this.virtualSets.has(key)) {
      const newSet = new EntitySet(listDef);
      this.virtualSets.set(key, newSet);
      return newSet;
    }
    return this.virtualSets.get(key);
  };
}

class EntitySet {
  constructor(entityType) {
    if (!entityType.ListDef) {
      console.error("Missing entityType listdef for", entityType);
      return;
    }

    // Check if the object we passed in defines a ListDef
    this.entityType = entityType;

    try {
      const allFieldsSet = new Set();
      entityType.Views?.All?.map((field) => allFieldsSet.add(field));

      // TODO: this is bombing due to circular dependencies,
      // all fields need to be in View
      // const newEntity = new this.entityType({ ID: null, Title: null });
      // if (newEntity.FieldMap) {
      //   Object.keys(newEntity.FieldMap).map((field) => allFieldsSet.add(field));
      // }
      // const fieldMapKeysSet = new Set(...);
      // entityType.Views.All.map((field) => fieldMapKeysSet.add(field));
      this.AllDeclaredFields = [...allFieldsSet];
    } catch (e) {
      console.warn("Could not instantiate", entityType), console.warn(e);
      this.AllDeclaredFields = entityType.Views?.All ?? [];
    }

    this.ListDef = entityType.ListDef;
    this.Views = entityType.Views;
    this.Title = entityType.ListDef.title;
    this.Name = entityType.ListDef.name;

    this.ListRef = new SPList(entityType.ListDef);

    this.entityConstructor =
      this.entityType.FindInStore || this.entityType.Create || this.entityType;
  }

  // TODO: Caching should be broken out via decorator pattern
  // OPTIONAL cache using array or knockout observable
  // _store = [];
  _store = ko.observableArray();
  _queryingAllItems = ko.observable(false);
  _allItemsQueried = false;

  // Queries
  // TODO: Feature - Queries should return options to read e.g. toList, first, toCursor
  FindById = async (id, fields = this.AllDeclaredFields) => {
    // Hit our cache first
    const cachedEntity = this._store().find((entity) => entity.ID == id);
    if (cachedEntity) return cachedEntity;

    // Next, check if we are querying the cache
    if (this._queryingAllItems()) {
      const foundEntity = await new Promise((resolve) => {
        const subscriber = this._queryingAllItems.subscribe(() => {
          subscriber.dispose();
          resolve(this._store().find((entity) => entity.ID == id));
        });
      });
      if (foundEntity) return foundEntity;
    }

    const result = await this.ListRef.findByIdAsync(id, fields);
    if (!result) return null;
    const newEntity = new this.entityType(result);
    mapObjectToEntity(result, newEntity);
    this._store.push(newEntity);
    return newEntity;
  };

  FindInStore = (id) => this._store().find((entity) => entity.ID == id);

  /**
   * Takes an array of columns and filter values with an optional comparison operator
   * @param {[{column, op?, value}]} columnFilters
   * @param {*} param1
   * @param {*} param2
   * @param {*} fields
   * @param {*} includeFolders
   * @returns
   */
  FindByColumnValue = async (
    columnFilters,
    { orderByColumn, sortAsc },
    { count = null, includePermissions = false },
    fields = this.AllDeclaredFields,
    includeFolders = false
  ) => {
    // if we pass in a count, we are expecting a cursor result
    const returnCursor = count != null;
    count = count ?? 5000;
    // else, we should apply a count of 5000 and keep fetching

    const results = await this.ListRef.findByColumnValueAsync(
      columnFilters,
      { orderByColumn, sortAsc },
      { count, includePermissions },
      fields,
      includeFolders
    );

    let cursor = {
      _next: results._next,
      results: results.results.map((item) => {
        const newEntity = new this.entityConstructor(item);
        mapObjectToEntity(item, newEntity);
        return newEntity;
      }),
    };

    if (returnCursor) {
      return cursor;
    }

    const resultObj = {
      results: cursor.results,
    };

    while (cursor._next) {
      cursor = await this.LoadNextPage(cursor);
      resultObj.results = resultObj.results.concat(cursor.results);
    }

    return resultObj;
  };

  LoadNextPage = async (cursor) => {
    const results = await this.ListRef.loadNextPage(cursor);
    return {
      _next: results._next,
      results: results.results.map((item) => {
        const newEntity = new this.entityType(item);
        mapObjectToEntity(item, newEntity);
        return newEntity;
      }),
    };
  };

  /**
   * Return all items in list
   */
  ToList = async (refresh = false) => {
    if (this._allItemsQueried && !refresh) return this._store();

    if (this._queryingAllItems()) {
      return new Promise((resolve) => {
        const hasLoadedSubscription = this._queryingAllItems.subscribe(
          (bool) => {
            hasLoadedSubscription.dispose();
            resolve(this._store());
          }
        );
      });
    }

    this._queryingAllItems(true);
    if (DEBUG)
      console.log(
        `ApplicationDbContext: Initializing ${this.ListDef.name} cache`
      );
    const fields = this.Views.All;
    const results = await this.ListRef.getListItemsAsync({ fields });
    const allItems = results.map((item) => {
      let entityToLoad = this.FindInStore(item.ID) ?? new this.entityType(item);
      mapObjectToEntity(item, entityToLoad);
      return entityToLoad;
    });
    this._store(allItems);
    this._queryingAllItems(false);
    this._allItemsQueried = true;
    return this._store();
  };

  LoadEntity = async function (entity, refresh = false) {
    if (!entity.ID) {
      console.error("entity missing Id", entity);
      return false;
    }
    let cachedEntity = this.FindInStore(entity.ID);

    if (!refresh && cachedEntity == entity) {
      console.warn("entity already in cache");
      return;
    }

    if (!cachedEntity) {
      cachedEntity = entity;
      this._store.push(cachedEntity);
    }

    const result = await this.ListRef.getById(
      cachedEntity.ID,
      this.AllDeclaredFields
    );
    if (!result) return null;

    mapObjectToEntity(result, cachedEntity);
    return cachedEntity;
  };

  // Mutators
  AddEntity = async function (entity, folderPath) {
    const creationfunc = mapEntityToObject.bind(this);
    const writeableEntity = creationfunc(entity);

    if (DEBUG) console.log(writeableEntity);
    const newId = await this.ListRef.createListItemAsync(
      writeableEntity,
      folderPath
    );
    mapObjectToEntity({ ID: newId }, entity);
    return;
  };

  UpdateEntity = async function (entity, fields = null) {
    const writeableEntity = mapEntityToObject.bind(this)(entity, fields);
    writeableEntity.ID =
      typeof entity.ID == "function" ? entity.ID() : entity.ID;
    if (DEBUG) console.log(writeableEntity);
    return this.ListRef.updateListItemAsync(writeableEntity);
  };

  RemoveEntity = async function (entity) {
    if (!entity.ID) return false;
    await this.ListRef.deleteListItemAsync(entity.ID);
    return true;
  };

  // Permissions

  SetItemPermissions = async function (entity, valuePairs, reset = false) {
    // const salValuePairs = valuePairs
    //   .filter((vp) => vp[0] && vp[1])
    //   .map((vp) => [vp[0].getKey(), vp[1]]);
    return this.ListRef.setItemPermissionsAsync(entity.ID, valuePairs, reset);
  };

  GetItemPermissions = function (entity) {
    return this.ListRef.getItemPermissionsAsync(entity.ID);
  };

  // Folder Methods
  GetFolderUrl = function (relFolderPath = "") {
    return this.ListRef.getServerRelativeFolderPath(relFolderPath);
  };

  GetItemsByFolderPath = async function (
    folderPath,
    fields = this.AllDeclaredFields
  ) {
    //return this.ListRef.getFolderContentsAsync(folderPath, fields);
    const results = await this.ListRef.getFolderContentsAsync(
      folderPath,
      fields
    );
    return results.map((result) => {
      const newEntity = new this.entityType(result);
      mapObjectToEntity(result, newEntity);
      return newEntity;
    });
  };

  UpsertFolderPath = async function (folderPath) {
    return this.ListRef.upsertFolderPathAsync(folderPath);
  };

  // Permissions
  SetFolderReadOnly = async function (relFolderPath) {
    return this.ListRef.setFolderReadonlyAsync(relFolderPath);
  };

  SetFolderPermissions = async function (folderPath, valuePairs, reset = true) {
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].getKey(), vp[1]]);
    return this.ListRef.setFolderPermissionsAsync(
      folderPath,
      salValuePairs,
      reset
    );
  };

  EnsureFolderPermissions = async function (relFolderPath, valuePairs) {
    // Slightly more expensive operation to verify a user has the required permissions
    // before adding them. This will cut down on the number of unique permissions in the
    // system since a user may already have the permission via group membership.
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].LoginName ?? vp[0].Title, vp[1]]);
    return this.ListRef.ensureFolderPermissionsAsync(
      relFolderPath,
      salValuePairs
    );
  };

  // Other Functions
  // Upload file directly from browser "File" object e.g. from input field
  UploadFileToFolderAndUpdateMetadata = async function (
    file,
    filename,
    folderPath,
    updates
  ) {
    const itemId = await this.ListRef.uploadFileToFolderAndUpdateMetadata(
      file,
      filename,
      folderPath,
      updates
    );
    const item = await this.ListRef.getById(itemId, this.AllDeclaredFields);
    const newEntity = new this.entityConstructor(item);
    mapObjectToEntity(item, newEntity);
    return newEntity;
  };

  // Open file upload Modal
  UploadNewDocument = async function (folderPath, args) {
    return this.ListRef.uploadNewDocumentAsync(
      folderPath,
      "Attach a New Document",
      args
    );
  };

  CopyFolderContents = async function (sourceFolder, targetFolder) {
    return this.ListRef.copyFilesAsync(sourceFolder, targetFolder);
  };

  // Form Methods
  ShowForm = async function (name, title, args) {
    return new Promise((resolve, reject) =>
      this.ListRef.showModal(name, title, args, resolve)
    );
  };

  CheckInDocument = async function (fileRef) {
    return new Promise((resolve) =>
      this.ListRef.showCheckinModal(fileRef, resolve)
    );
  };

  EnsureList = async function () {};
}

export function mapObjectToEntity(inputObject, targetEntity) {
  if (DEBUG)
    console.log(
      `ApplicationDBContext: ${targetEntity.constructor.name}: `,
      inputObject
    );
  if (!inputObject || !targetEntity) return;
  // Takes an object and attempts to map it to the target entity
  Object.keys(inputObject).forEach((key) => {
    mapValueToEntityProperty(key, inputObject[key], targetEntity);
  });
}

function mapValueToEntityProperty(propertyName, inputValue, targetEntity) {
  if (DEBUG)
    console.log(
      `ApplicationDBContext: ${targetEntity.constructor.name}.${propertyName} to ${inputValue}`
    );
  //1. Check if the targetEntity has a fieldmapping for this property
  if (targetEntity.FieldMap && targetEntity.FieldMap[propertyName]) {
    mapObjectToViewField(inputValue, targetEntity.FieldMap[propertyName]);
    return;
  }
  // 2. This is just a regular property, set it
  if (
    targetEntity[propertyName] &&
    typeof targetEntity[propertyName] == "function"
  ) {
    targetEntity[propertyName](inputValue);
    return;
  }
  targetEntity[propertyName] = inputValue;
  return;
}

function mapObjectToViewField(inVal, fieldMapping) {
  // Fieldmap has Three options for setting,
  // 1. observable - the fieldmap represents an observable
  // 2. setter - the fieldmap exposes a setter
  // 3. factory/obs - the fieldmap exposes a factory and an observable to put the result.

  if (typeof fieldMapping == "function") {
    fieldMapping(inVal);
    return;
  }

  if (typeof fieldMapping != "object") {
    fieldMapping = inVal;
    return;
  }

  if (fieldMapping.set && typeof fieldMapping.set == "function") {
    fieldMapping.set(inVal);
    return;
  }

  if (fieldMapping.obs) {
    if (!inVal) {
      fieldMapping.obs(null);
      return;
    }
    // If the input value is an array, then we are putting an array into the observable.
    const outVal = Array.isArray(inVal)
      ? inVal.map((item) => generateObject(item, fieldMapping))
      : generateObject(inVal, fieldMapping);

    fieldMapping.obs(outVal);
    return;
  }

  fieldMapping = inVal;
  //throw "Error setting fieldmap?";
}

function generateObject(inVal, fieldMap) {
  // If the fieldMap provides a factory, use that, otherwise return the value
  return fieldMap.factory ? fieldMap.factory(inVal) : inVal;
}

export function mapEntityToObject(input, selectedFields = null) {
  const entity = {};
  // We either predefine the fields in the ListDef, or provide a complete fieldmap
  const allWriteableFieldsSet = new Set([]);
  if (this?.ListDef?.fields) {
    this.ListDef.fields.forEach((field) => allWriteableFieldsSet.add(field));
  }
  if (input.FieldMap) {
    Object.keys(input.FieldMap).forEach((field) =>
      allWriteableFieldsSet.add(field)
    );
  }
  const allWriteableFields = [...allWriteableFieldsSet];

  const fields =
    selectedFields ??
    (input.FieldMap ? Object.keys(input.FieldMap) : null) ??
    Object.keys(input);

  fields
    .filter((field) => allWriteableFields.includes(field))
    .map((field) => {
      if (input.FieldMap && input.FieldMap[field]) {
        entity[field] = mapViewFieldToValue(input.FieldMap[field]);
        return;
      }
      entity[field] = input[field];
    });

  return entity;
}

function mapViewFieldToValue(fieldMap) {
  // Fieldmap has Three options for getting,
  // 1. observable - the fieldmap represents an observable or other function that returns a value
  // 2. get - the fieldmap is an object that exposes a getter function
  // 3. factory/obs - the fieldmap is an object exposes a factory and an observable.
  if (typeof fieldMap == "function") {
    return fieldMap();
  }
  if (fieldMap.get && typeof fieldMap.get == "function") {
    return fieldMap.get();
  }

  if (fieldMap.obs) {
    return fieldMap.obs();
  }

  return fieldMap;

  // console.error("Error setting fieldMap", fieldMap);
  // throw "Error getting fieldmap";
}

// export const _context = new ApplicationDbContext();

export const appContext = new ApplicationDbContext();
