
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = async () => {
  const response = await API.get("/");
  return response.data.data;
};

export const createTask = async (task) => {
  const response = await API.post("/", task);
  return response.data.data;
};

export const updateTask = async (id, task) => {
  const response = await API.put(`/${id}`, task);
  return response.data.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};
