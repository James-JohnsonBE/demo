import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/audit_styles.css", "./src/pages/ao_db.js"],
  bundle: true,
  minify: false,
  outdir: "dist",
});
