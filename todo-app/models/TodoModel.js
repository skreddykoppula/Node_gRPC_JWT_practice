const mongoose = require("mongoose");
const User = require('./UserModel')

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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User, 
    required: true,
    allowNull: false,
}
});





todoListSchema.methods = {

  setCompletionStatus() {
    try{
      const updatedTodo = this.updateOne({completed: (!this.completed)});
      return updatedTodo;
    } catch (error) {
      console.log("Error in mark as completed",error)
      throw error;
    }
  },

  deleteTodo(userId) {
    try {
      return this.deleteOne({userId});
    } catch (error) {
      console.log("Error in deleting the todo:", error);
    }
  },
}

todoListSchema.statics = {
  async addTodo({ title, dueDate, userId }) {
    try {
      return await this.create({ title: title, dueDate: dueDate, completed: false , userId});
    } catch (error) {
      console.log("Error in adding Todo:", error);
    }
  },

  
    async getAllTodos(userId) {
      try {
        return await this.find({userId});
      } catch (error) {
        console.log("Error in getAllTodo:", error);
      }
    },

    async overdue(userId) {
      try {
        const currentDate = new Date().toLocaleDateString("en-CA");
        return await this.find({ dueDate: { $lt: currentDate } , completed: false, userId});
      } catch (error) {
        console.log("Error in getting overdue:", error);
      }
    },
  
    async dueToday(userId) {
      try {
        const currentDate = new Date().toLocaleDateString("en-CA");
        return await this.find({ dueDate: { $eq: currentDate } , completed: false, userId});
      } catch (error) {
        console.log("Error in getting duetoday:", error);
      }
    },

    async dueLater(userId) {
      try {
        const currentDate = new Date().toLocaleDateString("en-CA");
        return await this.find({ dueDate: { $gt: currentDate } , completed: false,userId});
      } catch (error) {
        console.log("Error in getting duelater:", error);
      }
    },

    async completedItems(userId){
      try {
        return await this.find({completed: true,userId});
      } catch(error) {
        console.log("Error in getting completed items:", error);
      }
    },

};



module.exports = mongoose.model("TodoList", todoListSchema);
