import fs from "fs/promises";
import pg from "pg";

const pool = new pg.Pool({
  user: "khushiashta",
  host: "localhost",
  database: "todo_app",
  password: "", 
  port: 5432,
});

const migrate = async () => {
  const usersRaw = await fs.readFile("users.json", "utf-8");
  const todosRaw = await fs.readFile("todos.json", "utf-8");

  const users = usersRaw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));

  const todos = todosRaw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));

  const userIdMap = new Map();

  // Insert users
  for (const user of users) {
    const username = user.username;
    const email = user.email;

    if (!username || !email || !user.password) {
      console.warn(`Skipping user with missing fields:`, user);
      continue;
    }

    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (existing.rows.length > 0) {
      console.log(`Skipping existing user: ${username}`);
      userIdMap.set(user._id.$oid, existing.rows[0].id);
      continue;
    }

    const res = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, user.password]
    );

    userIdMap.set(user._id.$oid, res.rows[0].id);
    console.log(`Inserted user: ${username}`);
  }

  //  Insert todos
  for (const todo of todos) {
    const rawUserId = todo.userId?.$oid || todo.user?.$oid;
    const userId = userIdMap.get(rawUserId) || null;

    if (!userId) {
      console.warn(` Skipping todo "${todo.title}" – no matching userId`);
      continue;
    }

    await pool.query(
      `INSERT INTO todos (title, description, completed, created_at, user_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        todo.title || "Untitled",
        todo.description || "",
        todo.completed || false,
        todo.createdAt?.$date ? new Date(todo.createdAt.$date) : new Date(),
        userId,
      ]
    );

    console.log(` Inserted todo: ${todo.title}`);
  }

  console.log(" Migration completed.");
  await pool.end();
};

migrate().catch((err) => {
  console.error("Migration failed:", err);
  pool.end();
});
