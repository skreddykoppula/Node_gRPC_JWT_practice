const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    set: function (dueDate) {
      if (!(dueDate instanceof Date)) {
        dueDate = new Date(dueDate);
      }

      dueDate.setUTCHours(0, 0, 0, 0);
      return dueDate;
    },
    get: function (dueDate) {
      return dueDate.toISOString().split("T")[0];
    },
  },
  completed: {
    type: Boolean,
  },
});

todoListSchema.statics = {
  async createAndSaveTodo(TodoItem) {
    try {
      return await this.create(TodoItem);
    } catch (error) {
      console.log("Error in createAndSaveTodo:", error);
    }
  },

  async countTodo() {
    try {
      return await this.find({}).count();
    } catch (error) {
      console.log("Error in countTodo:", error);
    }
  },

  async getAllTodos() {
    try {
      return await this.find({});
    } catch (error) {
      console.log("Error in getAllTodo:", error);
    }
  },

  async showList() {
    console.log("My Todo list \n");
    console.log("Overdue");
    const overDueTaskList = await this.overdue();
    const formattedTasksOver = overDueTaskList.map((task) => {
      return displayableString(task);
    });
    const formattedTaskList = formattedTasksOver.join("\n");
    console.log(formattedTaskList);
    console.log("\n");

    console.log("Due Today");
    const dueTodayTodoList = await this.dueToday();
    const formattedTasksToday = dueTodayTodoList.map((task) => {
      return displayableString(task);
    });
    const formattedtaskListToday = formattedTasksToday.join("\n");
    console.log(formattedtaskListToday);
    console.log("\n");

    console.log("Due Later");
    const dueLaterTodoList = await this.dueLater();
    const formattedTasksLater = dueLaterTodoList.map((task) => {
        return displayableString(task);
      });
      const formattedtaskListLater = formattedTasksLater.join("\n");
      console.log(formattedtaskListLater);
  },

  async overdue() {
    try {
      const currentDate = new Date().toLocaleDateString("en-CA");
      return await this.find({ dueDate: { $lt: currentDate } });
    } catch (error) {
      console.log("Error in getting overdue:", error);
    }
  },

  async dueToday() {
    try {
      const currentDate = new Date().toLocaleDateString("en-CA");
      return await this.find({ dueDate: { $eq: currentDate } });
    } catch (error) {
      console.log("Error in getting duetoday:", error);
    }
  },  

  async dueLater() {
    try {
      const currentDate = new Date().toLocaleDateString("en-CA");
      return await this.find({ dueDate: { $gt: currentDate } });
    } catch (error) {
      console.log("Error in getting duelater:", error);
    }
  },

  async markAsComplete(id) {
    try {
      return await this.updateOne({ _id: id }, { $set: { completed: true } });
    } catch (error) {
      console.log("Error in getting duelater:", error);
    }
  },

};


function displayableString(item) {
    let checkbox = item.completed ? "[x]" : "[ ]";
    return `${item.id}. ${checkbox} ${item.title} ${item.dueDate}`;
  }

module.exports = mongoose.model("TodoList", todoListSchema);
