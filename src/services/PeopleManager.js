import { People } from "../entities/People.js";
import {
  ensureUserByKeyAsync,
  getDefaultGroups,
} from "../infrastructure/SAL.js";

const groupNameSpecialPermName1 = "CGFS Special Access1";
const groupNameSpecialPermName2 = "CGFS Special Access2";
const groupNameQA = "Quality Assurance";
const groupNameEA = "External Auditors";

export async function getSiteGroups() {
  const groups = await getDefaultGroups();
  const mappedGroups = {};
  Object.entries(groups).map(
    ([key, group]) => (mappedGroups[key] = new People(group))
  );
  return mappedGroups;
}

export async function getPeopleByUsername(userName) {
  const user = await ensureUserByKeyAsync(userName);
  if (!user) return null;
  return new People(user);
}

let specialGroups = null;
let specialGroupsLoading = ko.observable(false);
export async function getSpecialPermGroups() {
  if (specialGroups) return specialGroups;
  if (specialGroupsLoading()) {
    return new Promise((resolve) => {
      const subscriber = specialGroupsLoading.subscribe((specialGroups) => {
        subscriber.dispose();
        resolve(specialGroups);
      });
    });
  }
  specialGroupsLoading(true);
  const specialPermGroup1 = await getPeopleByUsername(
    groupNameSpecialPermName1
  );
  const specialPermGroup2 = await getPeopleByUsername(
    groupNameSpecialPermName2
  );

  specialGroups = {
    specialPermGroup1,
    specialPermGroup2,
  };

  specialGroupsLoading(false);

  return specialGroups;
}
