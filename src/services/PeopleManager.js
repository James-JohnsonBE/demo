import { People } from "../entities/People.js";
import {
  ensureUserByKeyAsync,
  getDefaultGroups,
} from "../infrastructure/SAL.js";

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
