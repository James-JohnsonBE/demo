import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: [
    "./src/audit_styles.css",
    "./src/pages/ao_db/ao_db.js",
    "./src/pages/bulk_add_response/bulk_add_response.js",
  ],
  bundle: true,
  minify: false,
  outdir: "dist",
});
