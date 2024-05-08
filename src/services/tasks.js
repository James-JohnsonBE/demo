import { ProgressTask, Task } from "../value_objects/task.js";
export const runningTasks = ko.observableArray();

export const blockingTasks = ko.pureComputed(() => {
  return runningTasks().filter((task) => task.IsBlocking()) ?? [];
});

export const taskDefs = {
  init: { msg: "Initializing the Application", blocking: true },
  save: { msg: "Saving Request", blocking: true },
  newRequest: { msg: "Processing New Request", blocking: true },
  cancelAction: { msg: "Cancelling Action", blocking: true },
  view: { msg: "Viewing Request", blocking: false },
  refresh: { msg: "Refreshing Request", blocking: false },
  permissionsRequest: {
    msg: "Updating Request Item Permissions",
    blocking: true,
  },
  permissionsResponse: (responseTitle) => {
    return {
      msg: "Updating Response Item Permissions: " + responseTitle,
      blocking: true,
    };
  },
  permissionsResponseFolder: (responseTitle) => {
    return {
      msg: "Updating Response Folder Item Permissions: " + responseTitle,
      blocking: true,
    };
  },
  permissionsResponseAndFolder: (responseTitle) => {
    return {
      msg: "Updating Response and Folder Item Permissions: " + responseTitle,
      blocking: true,
    };
  },
  permissionsEmailFolder: {
    msg: "Updating Email Folder Permissions",
    blocking: true,
  },
  permissionsCoversheet: (coversheetName) => {
    return {
      msg: "Updating Coversheet Permissions: " + coversheetName,
      blocking: true,
    };
  },
  deleteEmailFolder: { msg: "Deleting Email Folder", blocking: true },
  newResponse: (responseTitle) => {
    return {
      msg: "Submitting new Response: " + responseTitle,
      blocking: true,
    };
  },
  updateResponse: (responseTitle) => {
    return {
      msg: "Updating Response: " + responseTitle,
      blocking: true,
    };
  },
  deleteResponse: (responseTitle) => {
    return {
      msg: "Deleting Response: " + responseTitle,
      blocking: true,
    };
  },
  uploadResponseDoc: (responseDocTitle) => {
    return {
      msg: "Uploading Response Document: " + responseDocTitle,
      blocking: true,
      type: ProgressTask,
    };
  },
  updateResponseDoc: (responseDocTitle) => {
    return {
      msg: "Updating Response Document: " + responseDocTitle,
      blocking: true,
    };
  },
  approveResponseDoc: (responseDocTitle) => {
    return {
      msg: "Approving Response Document: " + responseDocTitle,
      blocking: true,
    };
  },
  deleteResponseDocFolder: (responseTitle) => {
    return {
      msg: "Deleting Response Document Folder: " + responseTitle,
      blocking: true,
    };
  },
  uploadCoversheet: (coversheetName) => {
    return {
      msg: "Uploading Coversheet: " + coversheetName,
      blocking: true,
      type: ProgressTask,
    };
  },
  updateCoversheet: (coversheetName) => {
    return {
      msg: "Updating Coversheet: " + coversheetName,
      blocking: true,
    };
  },
  deleteCoversheet: (coversheetName) => {
    return {
      msg: "Deleting Coversheet: " + coversheetName,
      blocking: true,
    };
  },
  deleteRequestInternalItem: {
    msg: "Deleting Request Internal Item",
    blocking: true,
  },
  newComment: { msg: "Submitting Comment", blocking: false },
  refreshComments: { msg: "Refreshing Comments", blocking: false },
  notifyComment: { msg: "Sending Comment Email", blocking: false },
  removeComment: { msg: "Removing Comment", blocking: false },
  newAction: { msg: "Submitting Action", blocking: false },
  refreshActions: { msg: "Refreshing Actions", blocking: false },
  newAttachment: { msg: "Submitting Attachment", blocking: false },
  refreshAttachments: { msg: "Refreshing Attachments", blocking: false },
  approve: { msg: "Approving Request", blocking: true },
  lock: { msg: "Locking Request", blocking: true },
  closing: { msg: "Closing Request", blocking: true },
};

export const addTask = (taskDef) => {
  let newTask;

  if (taskDef.type) {
    newTask = taskDef.type.Create(taskDef);
  } else {
    newTask = new Task(taskDef);
  }

  runningTasks.push(newTask);
  return newTask;
};

export const finishTask = function (activeTask) {
  if (activeTask) {
    activeTask.markComplete();
    window.setTimeout(() => removeTask(activeTask), 3000);
    // runningTasks.remove(activeTask);
  }
};

const removeTask = function (taskToRemove) {
  runningTasks.remove(taskToRemove);
};
