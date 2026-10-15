
function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const priorityClass = {
    High: "priority-high",
    Medium: "priority-medium",
    Low: "priority-low",
  };

  const statusClass = {
    Pending: "status-pending",
    "In Progress": "status-progress",
    Completed: "status-completed",
  };

  return (
    <article className="task-card">
      <div className="d-flex justify-content-between gap-3">
        <div className="flex-grow-1">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className={`task-badge ${priorityClass[task.priority]}`}>
              {task.priority} Priority
            </span>

            <span className={`task-badge ${statusClass[task.status]}`}>
              {task.status}
            </span>
          </div>

          <h6 className="fw-bold">{task.title}</h6>

          <p className="text-secondary small mb-3">
            {task.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="task-card-footer">
        <span className="text-secondary small">
          <i className="bi bi-calendar3 me-2" />
          {task.dueDate
            ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString()
            : "No due date"}
        </span>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm status-select"
            value={task.status}
            onChange={(event) =>
              onStatusChange(task, event.target.value)
            }
            aria-label={`Change status for ${task.title}`}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <i className="bi bi-pencil me-1" />
            Edit
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
          >
            <i className="bi bi-trash me-1" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
