const taskStates = {
  pending: "Pending",
  aging: "Aging",
  completed: "Completed",
};

export class Task {
  constructor({ msg, blocking }) {
    this.msg = msg;
    this.blocking = blocking;
    this.Status(taskStates.pending);
  }

  msg;
  blocking;
  Status = ko.observable();

  timeout = window.setTimeout(() => {
    console.warn("this task is aging:", this);
    this.Status(taskStates.aging);
  }, 5000);

  markComplete = () => {
    window.clearTimeout(this.timeout);
    this.Status(taskStates.completed);
  };

  // Should this task block user input?
  IsBlocking = ko.pureComputed(
    () => this.blocking && this.Status() != taskStates.completed
  );
}
