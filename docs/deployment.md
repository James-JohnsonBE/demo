1. Create Site (Publishing Site)
   - Set Master Page to Seattle
2. Add Lists
3. Add Pages

   - Add Page CEWPS
   - Break page permissions:

4. Add core groups to site permissions as necessary for each page (hint most of the pages are going to be restricted - to site owners/members, so don't do this until the role dashboard pages):

   - External Auditors
   - Quality Assurance
   - CGFS Special Access 1
   - CGFS Special Access 2
   - Restricted Readers

5. Break list permissions:

   - Inherits:

     - AuditCoverSheets
     - AuditResponseDocs
     - AuditAlerts
     - AuditEmails
     - AuditOrganizations
     - AuditResponses
     - Config

   - Broken:

     - AuditRequestDocs
     - AuditResponseDocsEA
     - AuditBulkPermissions
     - AuditBulkRequests
     - AuditBulkResponses
     - AuditEAEmailLog
     - AuditRequests
     - AuditRequestsInternal

6. Add Config entries:

   - current-fy
   - default-req-type

7. Add Audit Orgs

x lists
list permissions

pages
page cewps
page permission

Audit Orgs
owners
members
restricted readers
quality assurance

(every page execpt default/home page)
/sites/CGFS/Style Library/apps/tasker/src/Common_References.txt

AO_DB
/sites/CGFS/Style Library/apps/tasker/src/Pages/AO_DB/AO_DB_References.txt

<!--
No longer needed
AuditBulkAddRequest
/sites/CGFS/Style Library/apps/tasker/src/pages/BulkAddRequest/BulkAddRequest_References.txt
-->

AuditBulkAddResponse
/sites/CGFS/Style Library/apps/tasker/src/pages/bulk_add_response/BulkAddResponse_References.txt

AuditBulkEditResponse
/sites/CGFS/Style Library/apps/tasker/src/pages/bulk_edit_response/BulkEditResponse_References.txt

AuditPermissions
/sites/CGFS/Style Library/apps/tasker/src/pages/permissions/Permissions_References.txt

AuditReport_RequestsStatus
/sites/CGFS/Style Library/apps/tasker/src/pages/report_request_status/Report_RequestStatus_References.txt

AuditReturnedResponses
/sites/CGFS/Style Library/apps/tasker/src/pages/response_docs_returned_today/ResponseDocsReturnedToday_References.txt

AuditUnSubmittedResponseDocuments
/sites/CGFS/Style Library/apps/tasker/src/pages/response_docs_submitted_today/ResponseDocsSubmittedToday_References.txt

AuditUpdateSiteGroups
/sites/CGFS/Style Library/apps/tasker/src/pages/update_site_groups/UpdateSiteGroups_References.txt

default
/sites/CGFS/Style Library/apps/tasker/src/pages/home/Home_References.txt

RO_DB
/sites/CGFS/Style Library/apps/tasker/src/Pages/ro_db/RO_DB_References.txt

IA_DB
/sites/CGFS/Style Library/apps/tasker/src/Pages/ia_db/IA_DB_References.txt

QA_DB
/sites/CGFS/Style Library/apps/tasker/src/Pages/qa_db/QA_DB_References.txt

SP_DB
/sites/CGFS/Style Library/apps/tasker/src/Pages/sp_db/SP_DB_References.txt
