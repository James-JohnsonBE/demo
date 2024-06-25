import * as esbuild from "esbuild";

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
  ],
  bundle: true,
  minify: false,
  outdir: "dist",
});
