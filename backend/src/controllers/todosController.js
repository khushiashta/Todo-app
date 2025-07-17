import { pool } from "../config/db.js";

// Get all todos for the logged-in user
export const getTodos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new todo for the user
export const createTodo = async (req, res) => {
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos (title, description, user_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [title, description, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// Toggle a todo's completed status
export const toggleTodo = async (req, res) => {
  try {
    const check = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    const todo = check.rows[0];
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    const updated = await pool.query(
      "UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle todo" });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};












// import Todo from "../models/Todo.js";

// export const getTodos = async (req, res) => {
//   try {
//     const todos = await Todo.find({ user: req.user.id }); //  Only fetch user's todos
//     res.json(todos);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const createTodo = async (req, res) => {
//   const { title, description } = req.body;

//   try {
//     const newTodo = new Todo({
//       title,
//       description,
//       user: req.user.id, // Associate todo with logged-in user
//     });

//     await newTodo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create todo" });
//   }
// };

// export const toggleTodo = async (req, res) => {
//   try {
//     const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id }); // Only fetch your own todo
//     if (!todo) return res.status(404).json({ error: "Todo not found" });

//     todo.completed = !todo.completed;
//     await todo.save();

//     res.json(todo);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to toggle todo" });
//   }
// };

// export const deleteTodo = async (req, res) => {
//   try {
//     const todo = await Todo.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user.id,
//     });
//     if (!todo) return res.status(404).json({ error: "Todo not found" });

//     res.json({ message: "Todo deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete todo" });
//   }
// };
