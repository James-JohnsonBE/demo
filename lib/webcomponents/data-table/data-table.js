customElements.define(
  "data-table",
  class DataTable extends HTMLElement {
    constructor() {
      self = super();

      const templateContent = document.getElementById(
        "data-table-template"
      ).content;

      this.attachShadow({ mode: "open" }).appendChild(
        templateContent.cloneNode(true)
      );
      this.innerTable = this.querySelector("table");
      this.table = this.shadowRoot.appendChild(this.innerTable.cloneNode(true));
    }

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
            th.querySelector("i").classList.replace(
              "fa-sort-down",
              "fa-sort-up"
            );
            classList.replace("desc", "asc");
            sortOrder = -1;
          } else if (classList.contains("asc")) {
            th.querySelector("i").classList.replace(
              "fa-sort-up",
              "fa-sort-down"
            );
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

    onFilterEventHandler = (e) => {
      [...this.body.querySelectorAll("tr.hidden")].map((row) =>
        row.classList.remove("hidden")
      );

      [...this.body.querySelectorAll("td.filtered")].map((cell) =>
        cell.closest("tr").classList.add("hidden")
      );
      //updateFilters()
    };

    createFilters = () => {
      const filterTypes = {
        multiselect: multiselectElement,
        search: searchElement,
        checkbox: checkboxElement,
      };

      let filters = [];

      this.table
        .querySelectorAll("[data-filter]")
        .forEach((filterCell, index) => {
          const filterType = filterTypes[filterCell.dataset.filter];

          if (filterType) {
            const filter = new filterType(this.table, index);
            filterCell.replaceChildren(filter.element);
            filters.push(filter);
          }
        });

      return filters;
    };

    connectedCallback() {
      // const rowsArr = [...this.rows];

      /* TODO: 
    - Column Sorting and 
    - row count changes trigger select updates
    - implement search feature
    */

      // this.addEventListener("search", () => {
      //   [...this.body.querySelectorAll("tr:not(.hidden)")].map((row) =>
      //     row.classList.add("hidden")
      //   );

      //   [...this.body.querySelectorAll("td.included")].map((cell) =>
      //     cell.closest("tr").classList.remove("hidden")
      //   );
      //   //updateFilters()
      // });

      // Track our column level filters, includes filter element and other column filter methods
      let filters = [];

      let tableFilterEventListener;

      const init = () => {
        if (tableFilterEventListener)
          document.removeEventListener(tableFilterEventListener);

        this.shadowRoot
          .querySelector("table")
          .replaceWith(this.innerTable.cloneNode(true));

        this.table = this.shadowRoot.querySelector("table");

        tableFilterEventListener = this.table.addEventListener(
          "filter",
          this.onFilterEventHandler
        );

        this.head = this.table.querySelector("thead");
        this.body = this.table.querySelector("tbody");
        this.rows = this.body.rows;

        filters = this.createFilters();
        this.createSortListeners();
      };

      function search(searchTerm) {
        //remove our search designator from all items
        [...this.querySelectorAll(".included")].map((cell) =>
          cell.classList.remove("included")
        );

        let includedCells = [];
        filters.map(
          (filter) =>
            (includedCells = includedCells.concat(filter.search(searchTerm)))
        );

        includedCells.map((cell) => cell.classList.add("included"));

        const searchEvent = new Event("search");
        this.dispatchEvent(searchEvent);
      }

      const mutationCallback = (mutationList, observer) => {
        if (mutationList.find((mutation) => mutation.type == "childList"))
          init();
        // for (const mutation of mutationList) {
        //   if (mutation.type === "childList") {
        //     init();
        //   }
        // }
      };

      this.mutationObserver = new MutationObserver(mutationCallback);
      this.mutationObserver.observe(this.innerTable.querySelector("tbody"), {
        childList: true,
      });

      init();
    }
  }
);

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
