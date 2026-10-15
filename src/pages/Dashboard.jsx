
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskCard from "../components/TaskCard.jsx";
import { useTasks } from "../context/TaskContext.jsx";

function Dashboard() {
  const {tasks, addTask, updateTask, deleteTask, loading, error} = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const summaries = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: "bi-grid",
      color: "blue",
    },
    {
      label: "Pending",
      value: tasks.filter((t) => t.status === "Pending").length,
      icon: "bi-clock",
      color: "orange",
    },
    {
      label: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      icon: "bi-arrow-repeat",
      color: "purple",
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "Completed").length,
      icon: "bi-check2-circle",
      color: "green",
    },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = `${task.title} ${task.description}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (filter === "All" || task.status === filter)
      );
    });
  }, [tasks, search, filter]);

  const openCreateForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleSave = async (task) => {
    try {
      if (editingTask) {
        await updateTask(task);
      } else {
        await addTask(task);
      }

      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to save task. Please try again."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(id);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete task. Please try again."
      );
    }
  };


  return (
    <>
      <Navbar />

      <main className="dashboard-content">
        <section className="page-heading">
          <div>
            <h1>Tasks Dashboard</h1>
          </div>

          <button
            className="btn btn-primary create-btn"
            onClick={openCreateForm}
          >
            <i className="bi bi-plus-lg me-2" />
            Create Task
          </button>
        </section>

        <section className="summary-grid">
          {summaries.map((item) => (
            <div className="summary-card" key={item.label}>
              <div className={`summary-icon ${item.color}`}>
                <i className={`bi ${item.icon}`} />
              </div>

              <div>
                <p>{item.label}</p>
                <h2>{item.value}</h2>
              </div>
            </div>
          ))}
        </section>

        <section className="tasks-section">
          <div className="tasks-heading">
            <div>
              <h3>All Tasks</h3>
            </div>
          </div>

          <div className="task-toolbar">
            <div className="search-box">
              <i className="bi bi-search" />
              <input
                className="form-control"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="form-select filter-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tasks by status"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="task-list">
            {!loading && !error && (
              <>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(selectedTask) => {
                      setEditingTask(selectedTask);
                      setShowForm(true);
                    }}
                    onDelete={handleDelete}
                    onStatusChange={async (selectedTask, status) => {
                      try {
                        await updateTask({ ...selectedTask, status });
                      } catch (err) {
                        alert("Unable to update task status.");
                      }
                    }}
                  />
                ))}

                {filteredTasks.length === 0 && (
                  <div className="empty-state">
                    <i className="bi bi-clipboard2-check" />
                    <h5>No tasks found</h5>
                    <p>Try another search or create a new task.</p>

                    <button
                      className="btn btn-outline-primary"
                      onClick={openCreateForm}
                    >
                      Create your first task
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}

export default Dashboard;
