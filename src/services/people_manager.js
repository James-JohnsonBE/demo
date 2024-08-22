import { People } from "../sal/entities/index.js";
import {
  ensureUserByKeyAsync,
  getDefaultGroups,
  getUserPropsAsync,
} from "../sal/infrastructure/index.js";

const groupNameSpecialPermName1 = "CGFS Special Access1";
const groupNameSpecialPermName2 = "CGFS Special Access2";
const groupNameQA = "Quality Assurance";
const groupNameEA = "External Auditors";

export function getSiteGroups() {
  const groups = getDefaultGroups();
  const mappedGroups = {};
  Object.entries(groups).map(
    ([key, group]) => (mappedGroups[key] = new People(group))
  );
  return mappedGroups;
}

const _userPromiseMap = new Map();
export function getPeopleByUsername(userName) {
  if (!_userPromiseMap.has(userName)) {
    _userPromiseMap.set(
      userName,
      new Promise(async (resolve) => {
        const user = await ensureUserByKeyAsync(userName);
        if (!user) resolve(null);
        resolve(new People(user));
      })
    );
  }
  return _userPromiseMap.get(userName);
}

let _specialGroupsPromise = null;
export function getSpecialPermGroups() {
  if (_specialGroupsPromise) return _specialGroupsPromise;
  _specialGroupsPromise = new Promise(async (resolve, reject) => {
    const specialPermGroup1 = await getPeopleByUsername(
      groupNameSpecialPermName1
    );
    const specialPermGroup2 = await getPeopleByUsername(
      groupNameSpecialPermName2
    );
    resolve({ specialPermGroup1, specialPermGroup2 });
  });
  return _specialGroupsPromise;
}

export const getQAGroup = () => getPeopleByUsername(groupNameQA);

class User extends People {
  constructor({
    ID,
    Title,
    LoginName = null,
    LookupValue = null,
    WorkPhone = null,
    EMail = null,
    IsGroup = null,
    IsEnsured = false,
    Groups = null,
  }) {
    super({ ID, Title, LookupValue, LoginName, IsGroup, IsEnsured });

    this.WorkPhone = WorkPhone;
    this.EMail = EMail;

    this.Groups = Groups;
  }

  Groups = [];

  isInGroup(group) {
    if (!group?.ID) return false;
    return this.getGroupIds().includes(group.ID);
  }

  getGroupIds() {
    return this.Groups.map((group) => group.ID);
  }

  IsSiteOwner = ko.pureComputed(() =>
    this.isInGroup(getDefaultGroups().owners)
  );

  hasSystemRole = (systemRole) => {
    const userIsOwner = this.IsSiteOwner();
    switch (systemRole) {
      case systemRoles.Admin:
        return userIsOwner;
        break;
      case systemRoles.ActionOffice:
        return userIsOwner || this.ActionOffices().length;
      default:
    }
  };

  static _user = null;
  static Create = async function () {
    if (User._user) return User._user;
    // TODO: Major - Switch to getUserPropertiesAsync since that includes phone # etc
    const userProps = await getUserPropsAsync();
    // const userProps2 = await UserManager.getUserPropertiesAsync();
    User._user = new User(userProps);
    return User._user;
  };
}

export const currentUser = User.Create;
