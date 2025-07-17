import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import todosRoutes from "./routes/todosRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(rateLimiter);

app.use("/api/todos", todosRoutes); 
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});

// connectDB().then(() => {

// });
