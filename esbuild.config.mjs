import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";

let buildOpts = {
  sourcemap: true,
  minify: false,
  outdir: "dist",
};
let minify = false;
console.log(process.argv);
if (process.argv.includes("-p")) {
  // If we're in production, don't publish source maps
  console.log("Production Build");
  buildOpts.sourcemap = false;
  buildOpts.minify = true;
}

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
  ...buildOpts,
});

const referenceFiles = [
  "pages/ao_db/AO_DB.txt",
  "pages/bulk_add_response/BulkAddResponse.txt",
  "pages/ia_db/IA_DB.txt",
  "pages/ia_db/IA_DB_stage.txt",
  "pages/home/Home.txt",
  "pages/permissions/Permissions.txt",
  "pages/qa_db/QA_DB.txt",
  "pages/ro_db/RO_DB.txt",
  "pages/sp_db/SP_DB.txt",
  "pages/update_site_groups/UpdateSiteGroups.txt",
];

referenceFiles.forEach(copyReferenceFiles);
function copyReferenceFiles(filePath) {
  const srcTextFile = path.resolve("src/" + filePath);
  const destTextFile = path.resolve(buildOpts.outdir + "/" + filePath);
  fs.copyFileSync(srcTextFile, destTextFile);
}
