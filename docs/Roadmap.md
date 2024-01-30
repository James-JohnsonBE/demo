1. Remove “Reviewer” field on New Request form

2. Remove “Owner” field on New Request form

3. Hide “Request Documents” section

4. Add notification for Internal status comments

5. Add ability to tag (set sensitivity of) each individual file in zip file

6. Process to manage when action offices upload multiple responses in one zip file

7. Process for PDF redaction

8. Process for Request bulk load

9. Spreadsheet breakout, bulk sample upload/tagging

10. Unsubmitted response docs as dashboard rollup

Reorg Folder Structure
We're moving to style library anyways, may as well add preferred folder structure

Move Forms etc
Rebuild as needed

Remove old pages, we have them in version control if we ever need them again

x Remove/Move unused pages (ratings)

Bulk Add Requests:

x - Duplicate AuditRequests
x - Create New Editable Grid Page

Forms to be recreated:

AuditRequest

- [x] m_fnViewRequest
- [x] m_fnEditRequest

AuditCoverSheet

- [x] m_fnViewCoverSheet
- [x] m_fnEditCoverSheet
- [ ] m_fnUploadCoverSheet

AuditResponse

- [x] m_fnAddResponse
- [x] m_fnViewResponse
- [x] m_fnEditResponse

AuditResponseDoc

- [ ] m_fnViewResponseDoc
- [ ] m_fnEditResponseDoc

## General Todos

Add response doc rejection pathway.
Prepopulate new Request with all reminders selected.
Fix refresh on every action
Fix file rename (created has conflict with drag n drop edit)

## Search Select Todos

Ctrl-a to highlight multiple
Support query to update options

## Cleanup!

[ ] Lookupfield shouldn't query entire list.
[ ] Caching was a mistake (remove?)
