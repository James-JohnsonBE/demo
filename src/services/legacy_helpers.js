import { executeQuery } from "../sal/infrastructure/index.js";

export async function getAllItems(listTitle, fields = null) {
  let listItemsResults = [];
  let listItems;

  const currCtx = new SP.ClientContext.get_current();
  const web = currCtx.get_web();

  const list = web.get_lists().getByTitle(listTitle);

  const viewFields = viewFieldsStringBuilder(fields);

  const camlQuery = new SP.CamlQuery();
  camlQuery.set_viewXml(
    `<View Scope="RecursiveAll"><Query></Query><RowLimit>5000</RowLimit>${viewFields}</View>`
  );

  let position = new SP.ListItemCollectionPosition();
  position.set_pagingInfo("Paged=TRUE");

  while (position != null) {
    console.log("Legacy Helper - getAllItems", listTitle, position);
    camlQuery.set_listItemCollectionPosition(position);

    listItems = list.getItems(camlQuery);

    currCtx.load(listItems);

    await executeQuery(currCtx).catch((sender, args) => {
      console.warn(sender);
    });

    const listEnumerator = listItems.getEnumerator();
    while (listEnumerator.moveNext()) {
      listItemsResults.push(listEnumerator.get_current());
    }

    position = listItems.get_listItemCollectionPosition();
  }

  return listItemsResults;
}

function viewFieldsStringBuilder(fields) {
  if (!fields) return "";
  return `
  <ViewFields>${fields.map(
    (field) => `<FieldRef Name="${field}"></FieldRef>`
  )}</ViewFields>
  `;
}
