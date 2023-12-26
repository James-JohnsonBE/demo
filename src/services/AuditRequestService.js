import { appContext } from "../infrastructure/ApplicationDbContext.js";

export async function AddNewRequest(request) {
  const fields = request.FieldMap;

  // See if we have a request with this title already
  const existingRequests = await appContext.AuditRequests.FindByColumnValue(
    [{ column: "Title", value: fields.Title.Value() }],
    {},
    { count: 1 }
  );

  // TODO: use addFieldRequirement?
  if (existingRequests.results.length) {
    throw new Error("Request with this name already exists!");
  }

  request.FieldMap.EmailActionOffice.Value(
    request.FieldMap.ActionOffice.Value()
  );

  await appContext.AuditRequests.AddEntity(request);
}
