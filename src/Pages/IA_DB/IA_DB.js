import { InitReport } from "./IA_DB_Services.js";

const Audit = window.Audit || {};

if (document.readyState === "ready" || document.readyState === "complete") {
  InitReport();
} else {
  document.onreadystatechange = () => {
    if (document.readyState === "complete" || document.readyState === "ready") {
      ExecuteOrDelayUntilScriptLoaded(function () {
        SP.SOD.executeFunc("sp.js", "SP.ClientContext", InitReport);
      }, "sp.js");
    }
  };
}
