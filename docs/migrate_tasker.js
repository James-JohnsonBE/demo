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

/******************** MIGRATE RESPONSEDOCSRO ****************************/

async function shuffleResponseDocsRORest() {
  let uri =
    `../_api/web/GetListByTitle('AuditResponseDocsRO')/items` +
    `?$select=ID,RequestNumber,RequestSubject,ResponseID,ReqNum,ContentType/Name&$expand=ContentType` +
    // `&$filter=(ContentType eq 'Document') and (ReqNum eq null)` +
    `&$top=5000&$skiptoken=`;

  let skiptoken = "Paged=TRUE&p_ID=1";
  while (uri) {
    const results = await fetch(uri + skiptoken, {
      method: "GET",
      headers: {
        Accept: "application/json; odata=verbose",
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
      },
    }).then(async (response) => {
      if (!response.ok) {
        uri = null;
        return [];
      }
      const body = await response.json();
      uri = body.d.__next;
      return body.d.results.filter(
        (doc) => doc.ContentType.Name == "Document" && !doc.ReqNum
      );
    });

    // request = results.pop();
    // shuffleResponseDoc(request);

    // uri = false;
    //await Promise.all(results.map(shuffleResponseDoc));
    const total = results.length;
    const window = 300;
    let start = 0;
    let end = Math.min(start + window, total);
    while (end - start > 0) {
      console.log("Slicing: ", start, end, total);
      const subset = results.slice(start, end);

      await Promise.all(subset.map(shuffleResponseDoc));

      start = Math.min(start + window, total);
      end = Math.min(end + window, total);

      await sleep(4000);
      /*
        count++;
        console.log(`updating: ${result.ID} - ${count}/${total}`);
        shuffleResponseDoc(result);
  
        if (count % 20 == 0) {
          await sleep(400);
        }
        */
    }
  }

  console.log("Completed");
}

async function shuffleResponseDoc(doc) {
  if (doc.ContentType.Name != "Document" || doc.ReqNum) return false;
  const uri = `../_api/web/GetListByTitle('AuditResponseDocsRO')/items(${doc.ID})`;

  const result = await fetch(uri, {
    method: "POST",
    headers: {
      Accept: "application/json; odata=verbose",
      "Content-Type": "application/json; odata=verbose",
      "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
      "X-HTTP-Method": "MERGE",
      "If-Match": doc.__metadata.etag,
    },
    body: JSON.stringify({
      __metadata: {
        type: doc.__metadata.type,
      },
      ReqNum: doc.RequestNumber,
      ResID: doc.ResponseID,
      ReqSubject: doc.RequestSubject,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      console.warn("Could not update request", request, response);
    }
  });
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

shuffleResponseDocsRORest();
