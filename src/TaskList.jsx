import { useTask } from "./TaskProvider";
import TaskItem from "./TaskItem";


export default function TaskList() {
  const { activeTasks, currentTime } = useTask();

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