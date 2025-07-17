import express from "express";
import {
  getTodos,
  createTodo,
  toggleTodo,
  deleteTodo
} from "../controllers/todosController.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.use(Auth); // Protect all routes below

router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;









// import express from "express";
// import { signupUser, loginUser } from "../controllers/userController.js";
// import {
//   getTodos,
//   createTodo,
//   toggleTodo,
//   deleteTodo
// } from "../controllers/todosController.js";
// import Auth from "../middleware/auth.js";
// const router = express.Router();
// router.post("/auth/signup", signupUser);
// router.post("/auth/login", loginUser);
// router.use(Auth);
// router.get("/", getTodos);
// router.post("/", createTodo);
// router.patch("/:id/toggle", toggleTodo);
// router.delete("/:id", deleteTodo);

// export default router;
