import { useContext } from "react";
import { useTask } from "./TaskProvider";
import TaskItem from "./TaskItem";


export default function CompletedTaskList() {
  const { completedTasks } = useTask();

  return (
    <ul className="completed-task-list">
      {completedTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}