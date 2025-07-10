import mongoose from "mongoose";

// 1- create a schema
// 2- model based off of that schema



const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});

  const Todo = mongoose.model("Todo", todoSchema);

  export default Todo;




