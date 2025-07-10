import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }); //  Only fetch user's todos
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createTodo = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newTodo = new Todo({
      title,
      description,
      user: req.user.id, // Associate todo with logged-in user
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id }); // Only fetch your own todo
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
