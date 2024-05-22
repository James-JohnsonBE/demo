export class DataTable {
  constructor(table) {
    this.table = table;
    this.head = this.table.querySelector("thead");
    this.body = this.table.querySelector("tbody");
    this.rows = this.body.rows;
    this.connectedCallback();
  }

  onFilterEventHandler = (e) => {
    [...this.table.querySelectorAll("tbody tr.hidden")].map((row) =>
      row.classList.remove("hidden")
    );

    [...this.table.querySelectorAll("tbody td.filtered")].map((cell) =>
      cell.closest("tr").classList.add("hidden")
    );

    this.filteredCntElement.innerText = this.table.querySelectorAll(
      "tbody tr:not(.hidden)"
    ).length;
  };

  onSearchEventHandler = (e) => {
    [...this.table.querySelectorAll("tbody tr:not(.hidden)")].map((row) =>
      row.classList.add("hidden")
    );

    [...this.table.querySelectorAll("tbody td.included")].map((cell) =>
      cell.closest("tr").classList.remove("hidden")
    );
    //updateFilters()
  };

  createSortListeners = () => {
    const headerCells = this.table.querySelectorAll("thead th.sorter-true");

    for (const th of headerCells) {
      const cellIndex = th.cellIndex;

      // Add our sort icon
      let i = document.createElement("i");
      i.classList.add("fa-solid", "fa-sort");

      th.append(i);
      // Add the onclick event listener

      th.addEventListener("click", (e) => {
        // Reset our other sort icons
        for (const otherTh of headerCells) {
          if (!otherTh.classList.contains("sorter-true")) continue;

          if (otherTh != th) {
            otherTh.classList.remove("asc", "desc");
            otherTh
              .querySelector("i")
              .classList.remove("fa-sort-up", "fa-sort-down");
            otherTh.querySelector("i").classList.add("fa-sort");
          }
        }

        th.querySelector("i").classList.remove("fa-sort");

        let sortOrder = 0;
        const classList = th.classList;
        if (classList.contains("desc")) {
          th.querySelector("i").classList.replace("fa-sort-down", "fa-sort-up");
          classList.replace("desc", "asc");
          sortOrder = -1;
        } else if (classList.contains("asc")) {
          th.querySelector("i").classList.replace("fa-sort-up", "fa-sort-down");
          classList.replace("asc", "desc");
          sortOrder = 1;
        } else {
          th.querySelector("i").classList.add("fa-sort-down");
          classList.add("desc");
          sortOrder = 1;
        }

        var collator = new Intl.Collator([], { numeric: true });
        const rowsArr = [...this.rows];
        rowsArr.sort((tr1, tr2) => {
          const tr1Text = tr1.cells[cellIndex].textContent;
          const tr2Text = tr2.cells[cellIndex].textContent;
          //const comp = tr1Text.localeCompare(tr2Text)
          const comp = collator.compare(tr1Text, tr2Text);
          return comp * sortOrder;
        });

        this.body.append(...rowsArr);
      });
    }
  };

  createFilters = () => {
    const filterTypes = {
      multiselect: multiselectElement,
      search: searchElement,
      checkbox: checkboxElement,
    };

    let filters = [];

    this.table.querySelectorAll("[data-filter]").forEach((filterCell) => {
      const index = [...filterCell.parentElement.children].indexOf(filterCell);

      const filterType = filterTypes[filterCell.dataset.filter];

      if (filterType) {
        const filter = new filterType(this.table, index);
        filterCell.replaceChildren(filter.element);
        filters.push(filter);
      }
    });

    return filters;
  };

  createExportOptions = () => {
    // const tr = document.createElement("tr");
    // const cell = document.createElement("th");
    // cell.setAttribute(
    //   "colspan",
    //   this.table.querySelector("tr").children.length
    // );

    const div = document.createElement("div");
    div.classList.add("export-options", "quick-links", "secondary");

    const printButton = document.createElement("button");
    printButton.setAttribute("type", "button");
    printButton.setAttribute("title", "Click here to Print");
    printButton.classList.add("btn", "btn-link");
    printButton.innerHTML = `<i class="fa-solid fa-print"></i>`;
    printButton.addEventListener("click", () => {
      PrintPage(this.table.parentElement);
    });

    const exportButton = document.createElement("button");
    exportButton.setAttribute("type", "button");
    exportButton.setAttribute("title", "Export to CSV");
    exportButton.classList.add("btn", "btn-link");
    exportButton.innerHTML = `<i class="fa-solid fa-file-csv"></i>`;
    exportButton.addEventListener("click", () => {
      const fileName =
        this.table.dataset.filePrefix + new Date().format("yyyyMMdd_hhmmtt");
      exportTableToCsv(fileName, this.table);
    });

    div.append(printButton, exportButton);
    // div.innerHTML = `<div>
    // <button type="button" title="Print Table" class="btn btn-link"><i class="fa-solid fa-print"></i></button>
    // <button type="button" title="Export CSV" class="btn btn-link"><i class="fa-solid fa-file-csv"></i></button>
    // </div>`;

    // tr.append(cell);

    // const tfoot =
    //   this.table.querySelector("tfoot") ??
    //   this.table.append(document.createElement("tfoot"));

    // tfoot.append(tr);
    this.table.before(div);
  };

  createRowCount = () => {
    const tr = document.createElement("tr");
    const cell = document.createElement("th");
    cell.setAttribute(
      "colspan",
      this.table.querySelector("tr").children.length
    );

    // cell.innerHTML = `Displaying
    // <span
    //   class="table-count filtered-count"
    //   >0</span
    // >
    // out of
    // <span
    //   class="table-count total-count"
    //   >0</span
    // > items
    // `;

    const itemCount = this.table.querySelectorAll("tbody tr").length;

    this.filteredCntElement = document.createElement("span");
    this.filteredCntElement.classList.add("table-count", "filtered-count");

    this.totalCntElement = document.createElement("span");
    this.totalCntElement.classList.add("table-count", "total-count");

    this.filteredCntElement.innerText = itemCount;
    this.totalCntElement.innerText = itemCount;
    // this.rowCount = itemCount;

    cell.append(
      "Displaying ",
      this.filteredCntElement,
      " out of ",
      this.totalCntElement,
      " items"
    );
    tr.append(cell);

    let tfoot = this.table.querySelector("tfoot");
    if (!tfoot) {
      tfoot = document.createElement("tfoot");
      this.table.append(tfoot);
    }

    tfoot.append(tr);
  };

  //   search = (searchTerm) => {
  //     //remove our search designator from all items
  //     [...this.querySelectorAll(".included")].map((cell) =>
  //       cell.classList.remove("included")
  //     );

  //     let includedCells = [];
  //     this.filters.map(
  //       (filter) =>
  //         (includedCells = includedCells.concat(filter.search(searchTerm)))
  //     );

  //     includedCells.map((cell) => cell.classList.add("included"));

  //     const searchEvent = new Event("search");
  //     this.table.dispatchEvent(searchEvent);
  //   };

  init = () => {
    console.log("initing data-table", this.table);

    this.filters = this.createFilters();
    this.createSortListeners();

    this.createExportOptions();
    this.createRowCount();
  };

  connectedCallback() {
    // const rowsArr = [...this.rows];

    /* TODO: 
      - Column Sorting and 
      - row count changes trigger select updates
      - implement search feature
      */

    let tableSearchEventListener = this.table.addEventListener(
      "search",
      this.onSearchEventHandler
    );

    // Track our column level filters, includes filter element and other column filter methods
    let tableFilterEventListener = this.table.addEventListener(
      "filter",
      this.onFilterEventHandler
    );

    const mutationCallback = (mutationList, observer) => {
      if (!mutationList.find((mutation) => mutation.type == "childList"))
        return;

      if (this.body.querySelectorAll("tr").length !== this.rowCount)
        this.init();
      // for (const mutation of mutationList) {
      //   if (mutation.type === "childList") {
      //     init();
      //   }
      // }
    };

    this.mutationObserver = new MutationObserver(mutationCallback);
    // this.mutationObserver.observe(this.table.querySelector("tbody"), {
    //   childList: true,
    // });

    this.init();
  }
}

function searchElement(tbl, col) {
  // const rows = tbl.tbody.rows;
  const rows = tbl.querySelectorAll("tbody tr");

  const inputElem = document.createElement("input");
  inputElem.classList.add("border", "border-lightGray", "rounded", "w-[90%]");
  inputElem.setAttribute("placeholder", "Search...");

  const cells = [];
  for (let i = 0; i < rows.length; i++) {
    const cell = rows[i].getElementsByTagName("td")[col];
    cells.push(cell);
  }

  inputElem.addEventListener("keyup", (e) => {
    //cells.map(cell => cell.classList.remove('filtered'))
    const searchTerm = e.target.value;

    filter(searchTerm);

    const event = new Event("filter");
    tbl.dispatchEvent(event);
  });

  const search = (searchTerm) => searchCells(cells, searchTerm);
  const filter = (filterTerm) => filterCells(cells, filterTerm);

  //function search(searchVal) {
  //    cells.forEach(cell => {
  //        const val = cell.innerHTML.toString().toLowerCase()
  //        if (!val.includes(searchVal)) {
  //            cell.classList.add('filtered')
  //        } else {
  //            cell.classList.remove('filtered')
  //        }
  //    })
  //}

  return {
    element: inputElem,
    search,
    filter,
  };
}

function checkboxElement(tbl, col) {
  // const rows = tbl.tbody.rows;
  const rows = tbl.querySelectorAll("tbody tr");

  const inputElem = document.createElement("input");
  inputElem.setAttribute("type", "checkbox");
  inputElem.setAttribute("autocomplete", "off");
  inputElem.checked = "true";

  const cells = [];
  for (let i = 0; i < rows.length; i++) {
    const cell = rows[i].getElementsByTagName("td")[col];
    cells.push(cell);
  }

  inputElem.addEventListener("change", (e) => {
    //cells.map(cell => cell.classList.remove('filtered'))
    const searchTerm = e.target.checked ? "true" : "false";

    filter(e.target.checked);

    const event = new Event("filter");
    tbl.dispatchEvent(event);
  });

  const filter = (isChecked) => filterCheckBoxCells(cells, isChecked);
  const search = (searchTerm) => searchCells(cells, searchTerm);

  return {
    element: inputElem,
    search,
    filter,
  };
}

function multiselectElement(tbl, col) {
  // const rows = tbl.tbody.rows;
  const rows = tbl.querySelectorAll("tbody tr");

  const selectElem = document.createElement("search-select");
  selectElem.setAttribute("multiple", true);
  selectElem.classList.add("multiple");

  const cells = [];
  const selectVals = new Set();

  function populateOptions() {
    // Add our clear value
    //const opt = document.createElement('option')
    //opt.value = ""
    //opt.innerHTML = "Select...";
    //selectElem.appendChild(opt)

    for (const row of rows) {
      const cell = row.getElementsByTagName("td")[col];
      if (!cell) return;
      cells.push(cell);
      const val = cell.innerText;
      if (val) {
        selectVals.add(val);
      }
    }

    const opts = [...selectVals].sort().map((val) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.innerText = val;
      return opt;
    });

    selectElem.replaceChildren(...opts);
  }

  function tblRowsUpdate() {
    console.log("Rows added to table");
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].classList.contains("hidden")) {
        selectVals.delete(cells[i].innerHTML);
      } else {
        selectVals.add(cells[i].innerHTML);
      }
    }

    [...selectVals].sort().forEach((val) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.innerHTML = val;
      selectElem.appendChild(opt);
    });
  }

  // tbl.addEventListener('filter', update)

  selectElem.addEventListener("change", (e) => {
    const selectedVals = [...selectElem.selectedOptions].map(
      (opt) => opt.value
    );
    // Check if we're clearing this field
    const isClear = selectedVals[0] == "";
    filterArr(selectedVals);
    const event = new Event("filter");
    tbl.dispatchEvent(event);
  });

  const search = (searchTerm) => searchCells(cells, searchTerm);
  const filter = (filterTerm) => filterCells(cells, filterTerm);
  const filterArr = (filterTerms) => filterCellsArr(cells, filterTerms);

  populateOptions();

  return {
    element: selectElem,
    search,
    filter,
  };
}

function searchCells(cells, searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  return cells.filter((cell) => {
    const val = cell.innerText.toString().toLowerCase();
    return val.includes(searchTerm);
  });
}

function filterCells(cells, searchTerm) {
  searchTerm = searchTerm.toLowerCase();
  cells.map((cell) => {
    const val = cell.innerText.toString().toLowerCase();
    cell.classList.toggle("filtered", !val.includes(searchTerm));
  });
}

function filterCheckBoxCells(cells, isChecked) {
  cells.map((cell) => {
    cell.classList.toggle(
      "filtered",
      cell.querySelector("input").checked != isChecked
    );
  });
}

// Must match exact values in searchTerms array
function filterCellsArr(cells, searchTermsArr) {
  const isClear = searchTermsArr.flatMap((term) => term) == "";
  cells.map((cell) => {
    const val = cell.innerText;
    cell.classList.toggle(
      "filtered",
      !isClear && !searchTermsArr.includes(val)
    );
  });
}

/* Export Functionality */

function PrintPage(divTbl) {
  const pageTitle = divTbl.dataset.title;
  var curDate = new Date();
  var siteUrl = Audit.Common.Utilities.GetSiteUrl();
  var cssLink1 =
    siteUrl +
    "/siteassets/css/tablesorter/style.css?v=" +
    curDate.format("MM_dd_yyyy");
  var cssLink2 =
    siteUrl +
    "/siteAssets/css/audit_styles.css?v=" +
    curDate.format("MM_dd_yyyy");

  var divOutput = $(divTbl).html();

  //remove hyperlinks pointing to the job codes
  var updatedDivOutput = $("<div>").append(divOutput);
  updatedDivOutput.find(".sr1-request-requestNum a").each(function () {
    $(this).removeAttr("onclick");
    $(this).removeAttr("href");
  });

  updatedDivOutput.find(".sr2-response-requestNum a").each(function () {
    $(this).removeAttr("onclick");
    $(this).removeAttr("href");
  });

  divOutput = updatedDivOutput.html();

  var printDateString = curDate.format("MM/dd/yyyy hh:mm tt");
  printDateString =
    "<div style='padding-bottom:10px;'>" +
    printDateString +
    " - " +
    pageTitle +
    "</div>";

  divOutput = printDateString + divOutput;

  var cssFile1 = $("<div></div>");
  var cssFile2 = $("<div></div>");

  var def1 = $.Deferred();
  var def2 = $.Deferred();

  var cssFileText = "";
  cssFile1.load(cssLink1, function () {
    cssFileText += "<style>" + cssFile1.html() + "</style>";
    def1.resolve();
  });
  cssFile2.load(cssLink2, function () {
    cssFileText += "<style>" + cssFile2.html() + "</style>";
    def2.resolve();
  });

  //gets called asynchronously after the css files have been loaded
  $.when(def1, def2).done(function () {
    var html =
      "<HTML>\n" +
      "<HEAD>\n\n" +
      "<Title>" +
      pageTitle +
      "</Title>\n" +
      cssFileText +
      "\n" +
      "<style>" +
      ".hideOnPrint, .rowFilters, .actionOfficeContainer {display:none}" +
      "</style>\n" +
      "</HEAD>\n" +
      "<BODY>\n" +
      divOutput +
      "\n" +
      "</BODY>\n" +
      "</HTML>";

    var printWP = window.open("", "Print Web Part");
    if (!printWP) {
      alert("No printWebPart!");
      return;
    }
    printWP.document.open();
    //insert content
    printWP.document.write(html);

    printWP.document.close();
    //open print dialog
    printWP.print();
  });
}
//make sure iframe with id csvexprframe is added to page up top
//http://stackoverflow.com/questions/18185660/javascript-jquery-exporting-data-in-csv-not-working-in-ie
function exportTableToCsv(fileName, table, removeHeader) {
  var data = getCellValues(table);

  if (!data) {
    alert("No data!");
    return;
  }

  if (removeHeader == true) data = data.slice(1);

  var csv = ConvertToCsv(data);
  //	console.log( csv );
  if (navigator.userAgent.search("Trident") >= 0) {
    window.CsvExpFrame.document.open("text/html", "replace");
    //		window.CsvExpFrame.document.open("application/csv", "replace");
    //		window.CsvExpFrame.document.charset = "utf-8";
    //		window.CsvExpFrame.document.open("application/ms-excel", "replace");
    window.CsvExpFrame.document.write(csv);
    window.CsvExpFrame.document.close();
    window.CsvExpFrame.focus();
    window.CsvExpFrame.document.execCommand("SaveAs", true, fileName + ".csv");
  } else {
    var uri = "data:text/csv;charset=utf-8," + escape(csv);
    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = fileName + ".csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

function getCellValues(table) {
  //   var table = document.getElementById(tableName);

  if (!table) return;
  //remove headers and footers
  if (table.innerHTML.indexOf("rowFilters") >= 0) {
    var deets = $("<div>").append(table.outerHTML);
    deets.find(".rowFilters").each(function () {
      $(this).remove();
    });
    table = deets.find("table")[0];
  }
  if (table.innerHTML.indexOf("footer") >= 0) {
    var deets = $("<div>").append(table.outerHTML);
    deets.find(".footer").each(function () {
      $(this).remove();
    });
    table = deets.find("table")[0];
  }

  if (table.innerHTML.indexOf("actionOfficeContainer") >= 0) {
    var deets = $("<div>").append(table.outerHTML);
    deets.find(".actionOfficeContainer").each(function () {
      $(this).remove();
    });

    deets.find(".sr1-request-actionOffice-item").each(function () {
      var curText = $(this).text() + ", ";

      $(this).text(curText);
    });

    table = deets.find("table")[0];
  }

  var tableArray = [];
  for (var r = 0, n = table.rows.length; r < n; r++) {
    tableArray[r] = [];
    for (var c = 0, m = table.rows[r].cells.length; c < m; c++) {
      var text =
        table.rows[r].cells[c].textContent || table.rows[r].cells[c].innerText;
      tableArray[r][c] = text.trim();
    }
  }
  return tableArray;
}

function ConvertToCsv(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "sep=,\r\n";
  var line = "";
  var index;
  var value;
  for (var i = 0; i < array.length; i++) {
    line = "";
    var array1 = array[i];
    for (index in array1) {
      if (array1.hasOwnProperty(index)) {
        value = array1[index] + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    }
    line = line.slice(0, -1);
    str += line + "\r\n";
  }
  return str;
}
