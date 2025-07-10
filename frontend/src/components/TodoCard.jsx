import { Trash2Icon, CheckCircleIcon, CircleIcon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const TodoCard = ({ todo, setTodos }) => {
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this to-do?")) return;

    try {
      await api.delete(`/todos/${todo._id}`);
      setTodos((prev) => prev.filter((t) => t._id !== todo._id));
      toast.success("To-do deleted");
    } catch (error) {
      console.log("Error deleting todo", error);
      toast.error("Failed to delete to-do");
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/todos/${todo._id}/toggle`);
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (error) {
      console.log("Error toggling todo", error);
      toast.error("Failed to update to-do");
    }
  };

  return (
    <div
      className={`card bg-base-100 border-l-4 ${
        todo.completed ? "border-green-800" : "border-green-500"
      } hover:shadow-md transition-all duration-200`}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3
            className={`card-title text-base-content text-lg ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.title}
          </h3>
          <button
            className="btn btn-ghost btn-xs text-success"
            onClick={handleToggle}
            title={todo.completed ? "Mark as not done" : "Mark as done"}
          >
            {todo.completed ? (
              <CheckCircleIcon className="size-5" />
            ) : (
              <CircleIcon className="size-5" />
            )}
          </button>
        </div>

        {todo.description && (
          <p className="text-base-content/70 line-clamp-3">
            {todo.description}
          </p>
        )}

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-ghost btn-xs text-error"
            onClick={handleDelete}
          >
            <Trash2Icon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
