
import { useEffect, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

function TaskForm({ task, onSave, onClose }) {
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate || "",
          }
        : emptyTask
    );
  }, [task]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      ...(task ? { id: task.id } : {}),
    });
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="task-modal-card">
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">
              {task ? "Edit Task" : "Create New Task"}
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Task Title *</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              maxLength={120}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your task"
              rows="3"
              maxLength={1000}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="col-6 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-light"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
