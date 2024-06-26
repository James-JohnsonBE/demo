1. Create Site (Publishing Site)
   - Set Master Page to Seattle
2. Add Lists
3. Add Pages

   - Add Page CEWPS
   - Break page permissions:
   - Update Page Titles (use bulk edit in pages view)

4. Add core groups to site permissions as necessary for each page (hint most of the pages are going to be restricted to site owners/members, so don't do this until the role dashboard pages).

   1. All groups should be granted "Restricted Read" permission at the site level.
   2. All groups should have the Site Owners group as the site owner, and membership should be visible to everyone.

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
/sites/CGFS/Style Library/apps/audit/src/Common_References.txt

AO_DB
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/Pages/AO_DB/AO_DB_References.txt

<!--
No longer needed
AuditBulkAddRequest
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/BulkAddRequest/BulkAddRequest_References.txt
-->

AuditBulkAddResponse
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/bulk_add_response/BulkAddResponse.txt

AuditBulkEditResponse
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/bulk_edit_response/BulkEditResponse_References.txt

AuditPermissions
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/permissions/Permissions.txt

AuditReport_RequestsStatus
/sites/CGFS/Style Library/apps/audit/src/report_request_status/Report_RequestStatus_References.txt

AuditReturnedResponses
/sites/CGFS/Style Library/apps/audit/src/pages/response_docs_returned_today/ResponseDocsReturnedToday_References.txt

AuditUnSubmittedResponseDocuments
/sites/CGFS/Style Library/apps/audit/src/pages/response_docs_submitted_today/ResponseDocsSubmittedToday_References.txt

AuditUpdateSiteGroups
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/update_site_groups/UpdateSiteGroups.txt

default
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/pages/home/Home_References.txt

RO_DB
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/Pages/ro_db/RO_DB_References.txt

IA_DB
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/Pages/ia_db/IA_DB_References.txt

QA_DB
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/Pages/qa_db/QA_DB_References.txt

SP_DB
https://cdn.jsdelivr.net/gh/usdos-cgfs/audit-tool-pub@main/dist/Pages/sp_db/SP_DB_References.txt

/sites/CGFS/Style Library/apps/audit/src
