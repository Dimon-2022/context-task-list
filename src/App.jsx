//Rus
//Займитесь рефакторингом: вместо проброса пропсов используйте Context API.

//Eng
//Refactor the code. Use Context API instead of prop drilling.

import { useContext } from "react";
import { useTask } from "./TaskProvider";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CompletedTaskList from "./CompletedTaskList";
import Footer from "./Footer";


function App() {
  const { openSection, toggleSection, sortType, toggleSortOrder, sortOrder } =
    useTask();
  return (
    <div className="app">
      <div className="task-container">
        <h1>Task List with Priority</h1>
        <button
          className={`close-button ${openSection.taskList ? "open" : ""}`}
          onClick={() => toggleSection("taskList")}
        >
          +
        </button>
        {openSection.taskList && <TaskForm />}
      </div>
      <div className="task-container">
        <h2>Tasks</h2>
        <button
          className={`close-button ${openSection.tasks ? "open" : ""}`}
          onClick={() => toggleSection("tasks")}
        >
          +
        </button>
        <div className="sort-controls">
          <button
            className={`sort-button ${sortType === "date" ? "active" : ""}`}
            onClick={() => toggleSortOrder("date")}
          >
            By Date{" "}
            {sortType === "date" && (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
          <button
            className={`sort-button ${sortType === "priority" ? "active" : ""}`}
            onClick={() => toggleSortOrder("priority")}
          >
            By Priority{" "}
            {sortType === "priority" &&
              (sortOrder === "asc" ? "\u2191" : "\u2193")}
          </button>
        </div>
        {openSection.tasks && <TaskList />}
      </div>
      <div className="completed-task-container">
        <h2>Completed Task</h2>
        <button
          className={`close-button ${openSection.completedTasks ? "open" : ""}`}
          onClick={() => toggleSection("completedTasks")}
        >
          +
        </button>
        {openSection.completedTasks && <CompletedTaskList />}
      </div>
      <Footer />
    </div>
  );
}

export default App;
