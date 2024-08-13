var currCtx = new SP.ClientContext.get_current();
var web = currCtx.get_web();
var responseDocsLib = web.get_lists().getByTitle("AuditResponseDocs");
var responseDocsQuery = new SP.CamlQuery();
responseDocsQuery.set_viewXml(
  '<View Scope="RecursiveAll"><Query>' +
    '<OrderBy><FieldRef Name="ReqNum"/><FieldRef Name="ResID"/></OrderBy>' +
    "</Query></View>"
);
const m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
currCtx.load(
  m_ResponseDocsItems,
  "Include(ID, Title, ReqNum, ResID, DocumentStatus, RejectReason, ReceiptDate, FileLeafRef, FileDirRef, File_x0020_Size, CheckoutUser, Modified, Editor, Created)"
);
currCtx.executeQueryAsync(() => console.log("success"), console.log);

// ResponseDocs

var currCtx = new SP.ClientContext.get_current();
var web = currCtx.get_web();
var responseList = web.get_lists().getByTitle("AuditResponses");
var responseQuery = new SP.CamlQuery();
responseQuery.set_viewXml(
  "<View><Query>" +
    '<Where><Neq><FieldRef Name="ResStatus"/><Value Type="Text">7-Closed</Value></Neq></Where>' +
    '<OrderBy><FieldRef Name="ReqNum"/></OrderBy>' +
    "</Query></View>"
);
const m_responseItems = responseList.getItems(responseQuery);
//need to check permissions because of granting/removing special perms

currCtx.load(
  m_responseItems,
  "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)"
);

currCtx.executeQueryAsync(() => console.log("success"), console.log);


// UPDATED CODE
console.log("Executing Script")
let currCtx = new SP.ClientContext.get_current();
let web = currCtx.get_web();
var responseDocsLib = web.get_lists().getByTitle("AuditResponseDocs");
var responseDocsQuery = new SP.CamlQuery();
  responseDocsQuery.set_viewXml(
    '<View Scope="RecursiveAll"><Query></Query><RowLimit>5000</RowLimit></View>'
  );

    var position = new SP.ListItemCollectionPosition();
    position.set_pagingInfo('Paged=TRUE&p_ID=1');
    responseDocsQuery.set_listItemCollectionPosition(position);

responseDocsQuery.get_listItemCollectionPosition()

const m_ResponseDocsItems = responseDocsLib.getItems(responseDocsQuery);
currCtx.load(
m_ResponseDocsItems
);

currCtx.executeQueryAsync(() => {
    console.log("Response docs success", m_ResponseDocsItems.get_count());
               
    console.log("Items Position", m_ResponseDocsItems.get_listItemCollectionPosition());
    }, console.log);



async function getAllItems(listTitle) {
    let listItemsResults = [];

    const currCtx = new SP.ClientContext.get_current();
    const web = currCtx.get_web();

    const list = web.get_lists().getByTitle(listTitle);
    const camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View Scope="RecursiveAll"><Query></Query><RowLimit>5000</RowLimit></View>'
      );

    let position = new SP.ListItemCollectionPosition();
    position.set_pagingInfo('Paged=TRUE&p_ID=1');


    while (position != null) {

        camlQuery.set_listItemCollectionPosition(position);

        listItems = list.getItems(camlQuery);

        currCtx.load(listItems)
        
        await executeQuery(currCtx).catch((sender, args) => {
            console.warn(sender)
        });

        const listEnumerator = listItems.getEnumerator();
        while (listEnumerator.moveNext()) {
            listItemsResults.push(listEnumerator.get_current())
        }

        position = listItems.get_listItemCollectionPosition()
    } 

    return listItemsResults;
}

/* REFERENCES:
https://sharepoint.stackexchange.com/questions/69650/sp-2010-client-object-model-javascript-how-to-use-get-listitemcollectionpo
https://sharepoint.stackexchange.com/questions/216562/caml-query-going-around-the-5000-list-item-threshold
*/
