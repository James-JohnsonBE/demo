import { SPList } from "./SAL.js";
import { AuditOrganization } from "../entities/AuditOrganization.js";

const DEBUG = false;

// let context = null;

// export function CreateAppContext() {
//   if (context) {
//     return;
//   }
//   context = new ApplicationDbContext();
// }

// export function getAppContext() {
//   return context;
// }

// export const lookupType = {
//   value: "LookupValue",
//   id: "LookupID",
// };

export default class ApplicationDbContext {
  constructor() {}

  AuditOrganizations = new EntitySet(AuditOrganization);

  virtualSets = new Map();

  Set = (listDef) => {
    const key = listDef.name;
    if (!this.virtualSets.has(key)) {
      const newSet = new EntitySet(listDef);
      this.virtualSets.set(key, newSet);
      return newSet;
    }
    return this.virtualSets.get(key);
  };
}

export const appContext = new ApplicationDbContext();

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
      const newEntity = new this.entityType({ ID: null, Title: null });
      if (newEntity.FieldMap) {
        Object.keys(newEntity.FieldMap).map((field) => allFieldsSet.add(field));
      }
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

  // Queries
  // TODO: Feature - Queries should return options to read e.g. toList, first, toCursor
  FindById = async (id, fields = this.AllDeclaredFields) => {
    const result = await this.ListRef.findByIdAsync(id, fields);
    if (!result) return null;
    const newEntity = new this.entityType(result);
    mapObjectToEntity(result, newEntity);
    return newEntity;
  };

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
    { count = null },
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
      { count },
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
      resultObj.results.concat(cursor.results);
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
  ToList = async (fields = this.Views.All) => {
    const results = await this.ListRef.getListItemsAsync({ fields });
    return results.map((item) => {
      const newEntity = new this.entityType(item);
      mapObjectToEntity(item, newEntity);
      return newEntity;
    });
  };

  LoadEntity = async function (entity) {
    if (!entity.ID) {
      console.error("entity missing Id", entity);
      return false;
    }
    const item = await this.ListRef.findByIdAsync(
      entity.ID,
      this.ListDef.fields
    );
    if (!item) {
      console.warn("ApplicationDbContext Could not find entity", entity);
      return false;
    }
    mapObjectToEntity(item, entity);
    return true;
  };

  // Mutators
  AddEntity = async function (entity, folderPath, request = null) {
    const creationfunc = mapEntityToObject.bind(this);
    const writeableEntity = creationfunc(entity);

    if (request) {
      writeableEntity.Title = request.Title;
      writeableEntity.Request = request;
    }
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
  SetItemPermissions = async function (entityId, valuePairs, reset = false) {
    const salValuePairs = valuePairs
      .filter((vp) => vp[0] && vp[1])
      .map((vp) => [vp[0].getKey(), vp[1]]);
    return this.ListRef.setItemPermissionsAsync(entityId, salValuePairs, reset);
  };

  GetItemPermissions = function (id) {
    return this.ListRef.getItemPermissionsAsync(id);
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

  EnsureList = async function () {};
}

export function mapObjectToEntity(inputObject, targetEntity) {
  if (!inputObject || !targetEntity) return;
  // Takes an object and attempts to map it to the target entity
  Object.keys(inputObject).forEach((key) => {
    mapValueToEntityProperty(key, inputObject[key], targetEntity);
  });
}

function mapValueToEntityProperty(propertyName, inputValue, targetEntity) {
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

function mapObjectToViewField(inVal, fieldMap) {
  // Fieldmap has Three options for setting,
  // 1. observable - the fieldmap represents an observable
  // 2. setter - the fieldmap exposes a setter
  // 3. factory/obs - the fieldmap exposes a factory and an observable to put the result.

  if (typeof fieldMap == "function") {
    fieldMap(inVal);
    return;
  }

  if (typeof fieldMap != "object") {
    fieldMap = inVal;
    return;
  }

  if (fieldMap.set && typeof fieldMap.set == "function") {
    fieldMap.set(inVal);
    return;
  }

  if (fieldMap.obs) {
    if (!inVal) {
      fieldMap.obs(null);
      return;
    }
    // If the input value is an array, then we are putting an array into the observable.
    const outVal = Array.isArray(inVal)
      ? inVal.map((item) => generateObject(item, fieldMap))
      : generateObject(inVal, fieldMap);

    fieldMap.obs(outVal);
    return;
  }

  fieldMap = inVal;
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
