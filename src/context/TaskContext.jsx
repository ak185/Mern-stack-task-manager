
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getTasks as fetchTasks,
  createTask as createTaskAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "../services/taskService";

const TaskContext = createContext(null);

// Convert MongoDB task to the format used by the UI.
const normalizeTask = (task) => ({
  ...task,
  id: task._id,
  dueDate: task.dueDate
    ? task.dueDate.slice(0, 10)
    : "",
});

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setError("");
        const data = await fetchTasks();
        setTasks(data.map(normalizeTask));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load tasks. Check whether the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (task) => {
    const savedTask = await createTaskAPI(task);
    setTasks((prev) => [normalizeTask(savedTask), ...prev]);
  };

  const updateTask = async (updatedTask) => {
    const { id, ...taskData } = updatedTask;

    const savedTask = await updateTaskAPI(id, taskData);
    const normalizedTask = normalizeTask(savedTask);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? normalizedTask : task
      )
    );
  };

  const deleteTask = async (id) => {
    await deleteTaskAPI(id);

    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
}
