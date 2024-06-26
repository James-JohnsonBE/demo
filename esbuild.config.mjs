import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";

await esbuild.build({
  entryPoints: [
    "./src/audit_styles.css",
    "./src/pages/ao_db/ao_db.js",
    "./src/pages/bulk_add_response/bulk_add_response.js",
    "./src/pages/ia_db/ia_db.js",
    "./src/pages/permissions/permissions.js",
    "./src/pages/qa_db/qa_db.js",
    "./src/pages/ro_db/ro_db.js",
    "./src/pages/sp_db/sp_db.js",
    "./src/pages/update_site_groups/update_site_groups.js",
  ],
  bundle: true,
  minify: true,
  outdir: "dist",
});

const referenceFiles = [
  "pages/ao_db/AO_DB.txt",
  "pages/bulk_add_response/BulkAddResponse.txt",
  "pages/ia_db/IA_DB.txt",
  "pages/permissions/Permissions.txt",
  "pages/qa_db/QA_DB.txt",
  "pages/ro_db/RO_DB.txt",
  "pages/sp_db/SP_DB.txt",
  "pages/update_site_groups/UpdateSiteGroups.txt",
];

referenceFiles.forEach(copyReferenceFiles);
function copyReferenceFiles(filePath) {
  const srcTextFile = path.resolve("src/" + filePath);
  const destTextFile = path.resolve("dist/" + filePath);
  fs.copyFileSync(srcTextFile, destTextFile);
}
