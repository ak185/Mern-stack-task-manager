
import { TaskProvider } from "./context/TaskContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

export default App;
