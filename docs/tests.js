var currCtx = new SP.ClientContext.get_current();
var web = currCtx.get_web();
var responseDocsLib = web.get_lists().getByTitle("AuditResponseDocs");
var responseDocsQuery = new SP.CamlQuery();
responseDocsQuery.set_viewXml(
  '<View><Query><Where><And><BeginsWith><FieldRef Name="Title"/><Value Type="Text">' +
    "LESAEB-025-2024" +
    '-</Value></BeginsWith><Eq><FieldRef Name="ContentType" /><Value Type="Text">Folder</Value></Eq></And></Where></Query></View>'
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
  '<View><Query><Where><Eq><FieldRef Name="ReqNum"/><Value Type="Text">' +
    oRequest.number +
    "</Value></Eq></Where></Query></View>"
);
const m_responseItems = responseList.getItems(responseQuery);
//need to check permissions because of granting/removing special perms

currCtx.load(
  m_responseItems,
  "Include(ID, Title, ReqNum, ActionOffice, ReturnReason, SampleNumber, ResStatus, ActiveViewers, Comments, Modified, ClosedDate, ClosedBy, POC, POCCC)"
);

currCtx.executeQueryAsync(() => console.log("success"), console.log);
