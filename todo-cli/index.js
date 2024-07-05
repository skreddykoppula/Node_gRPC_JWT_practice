const TodoList = require('./TodoModel');
const connect = require('./connectDB');
const mongoose = require('mongoose');

(async () => {
  try {
    await connect(); 
    await createTodo();
    await countTodo();
    await getAllTodos();
    await TodoList.showList();
  } catch (error) {
    console.error("Error:", error);
  }  finally{
    mongoose.disconnect();
  }
})();

const createTodo = async () => {
  try {
    const todo = await TodoList.createAndSaveTodo({
      title: "hello",
      dueDate: new Date().toISOString().split('T')[0],
      completed: true,
    });
    console.log(`Todo created with id ${todo._id}`);
  } catch (error) {
    console.log("Error creating todo:", error);
  }
};

const countTodo = async () => {
  try {
    const count = await TodoList.countTodo();
    console.log(`Todo count is ${count}`);
  } catch (error) {
    console.log("Error counting todos:", error);
  }
};


const getAllTodos = async () => {
    try {
      const todos = await TodoList.getAllTodos();
      todos.map((todo) => {
        console.log(`${todo.completed ? "[X]" : "[ ]"} - ${todo.title} - ${todo.dueDate}`)
      })
      console.log(`Todos are ${todos}`);
    } catch (error) {
      console.log("Error in getting all todos:", error);
    }
  };
