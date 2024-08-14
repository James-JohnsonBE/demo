const listUri = `../_api/web/GetListByTitle('AuditRequests')/items`;
let request;

let auditOrgs = await getAuditOrgs("AuditOrganizations");

async function getAuditOrgs(listName) {
  const uri =
    `../_api/web/GetListByTitle('${listName}')/items` +
    `?$select=ID,Title&$top=5000`;

  const results = await fetch(uri, {
    method: "GET",
    headers: {
      Accept: "application/json; odata=verbose",
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
    },
  }).then(async (response) => {
    if (!response.ok) {
      return [];
    }
    const body = await response.json();
    return body.d.results;
  });

  return results;
}

async function shuffleRequestingOfficesRest() {
  const uri =
    listUri +
    `?$select=ID,RequestingOffice_,RequestingOffice/Title&$expand=RequestingOffice&$top=5000` +
    `&$filter=RequestingOffice_ ne null`;

  const requests = await fetch(uri, {
    method: "GET",
    headers: {
      Accept: "application/json; odata=verbose",
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
    },
  }).then(async (response) => {
    if (!response.ok) {
      return [];
    }
    const body = await response.json();
    return body.d.results;
  });

  // request = requests.pop()
  // shuffleRequestingOffice(request);

  await Promise.all(requests.map(shuffleRequestingOffice));
}

async function shuffleRequestingOffice(request) {
  const uri = listUri + `(${request.ID})`;
  const reqOffice = request.RequestingOffice_;
  const reqOrg = auditOrgs.find((org) => org.Title == reqOffice);

  if (!reqOrg) {
    console.warn("could not find org: ", reqOffice);
    return;
  }

  const result = await fetch(uri, {
    method: "POST",
    headers: {
      Accept: "application/json; odata=verbose",
      "Content-Type": "application/json; odata=verbose",
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
      "X-HTTP-Method": "MERGE",
      "If-Match": request.__metadata.etag,
    },
    body: JSON.stringify({
      __metadata: {
        type: request.__metadata.type,
      },
      RequestingOfficeId: reqOrg.ID,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      console.warn("Could not update request", request, response);
    }
  });
}

shuffleRequestingOfficesRest();
