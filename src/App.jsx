//Rus
//Займитесь рефакторингом: вместо проброса пропсов используйте Context API.

//Eng
//Refactor the code. Use Context API instead of prop drilling.

import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

const MyContext = createContext();

function App() {
  const [tasks, setTasks] = useState([]);
  const [sortType, setSortType] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [openSection, setOpenSection] = useState({
    taskList: false,
    tasks: true,
    completedTasks: true,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function toggleSection(section) {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  function addTask(task) {
    setTasks([...tasks, { ...task, completed: false, id: Date.now() }]);
  }

  const deleteTask = function (id) {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completeTask = function (id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  function sortTask(tasks) {
    return tasks.slice().sort((a, b) => {
      if (sortType === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      }
    });
  }

  function toggleSortOrder(type) {
    if (sortType === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  }

  const activeTasks = sortTask(tasks.filter((task) => !task.completed));
  const completedTasks = sortTask(tasks.filter((task) => task.completed));

  return (
    <MyContext.Provider
      value={{
        completedTasks,
        addTask,
        completeTask,
        deleteTask,
        activeTasks,
        currentTime,
      }}
    >
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
              {sortType === "date" &&
                (sortOrder === "asc" ? "\u2191" : "\u2193")}
            </button>
            <button
              className={`sort-button ${
                sortType === "priority" ? "active" : ""
              }`}
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
            className={`close-button ${
              openSection.completedTasks ? "open" : ""
            }`}
            onClick={() => toggleSection("completedTasks")}
          >
            +
          </button>
          {openSection.completedTasks && <CompletedTaskList />}
        </div>
        <Footer />
      </div>
    </MyContext.Provider>
  );
}

function TaskForm() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");
  const { addTask } = useContext(MyContext);

  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() && deadline) {
      addTask({ title, priority, deadline });
      setTitle("");
      setPriority("Low");
      setDeadline("");
    }
  }

  return (
    <form action="" className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        placeholder="Task title"
        required
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="datetime-local"
        required
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">Add task</button>
    </form>
  );
}

function TaskList() {
  const { activeTasks, currentTime } = useContext(MyContext);

  return (
    <ul className="task-list">
      {activeTasks.map((task) => (
        <TaskItem
          task={task}
          key={task.id}
          isOverdue={new Date(task.deadline) < currentTime}
        />
      ))}
    </ul>
  );
}

function CompletedTaskList() {
  const { completedTasks } = useContext(MyContext);

  return (
    <ul className="completed-task-list">
      {completedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

function TaskItem({ task, isOverdue }) {
  const { title, priority, deadline, id, completed } = task;

  const { deleteTask, completeTask } = useContext(MyContext);

  return (
    <li
      className={`task-item ${priority.toLowerCase()} ${
        isOverdue ? "overdue" : ""
      }`}
    >
      <div className="task-info">
        <div>
          {title} <strong>{priority}</strong>
        </div>
        <div className="task-deadline">
          Due: {new Date(deadline).toLocaleString()}
        </div>
      </div>
      <div className="task-buttons">
        {!completed && (
          <button className="complete-button" onClick={() => completeTask(id)}>
            Complete
          </button>
        )}
        <button className="delete-button" onClick={() => deleteTask(id)}>
          Delete
        </button>
      </div>
    </li>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Technologies and React concepts used: React, JSX, props, useEffect,
        useState, component composition, conditional rendering, array methods
        (map, filter), event handling.
      </p>
    </footer>
  );
}

export default App;
