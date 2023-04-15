import { TaskI } from "../../factories/task";

import { getActualTimestamp } from "../../utils/getActualTimestamp";

import { playAnimation } from "../../utils/playAnimation";

import { setTask, deleteTask } from "../../features/userDataSlice";
import { useDispatch } from "react-redux";

import { editTask } from "../../firebase/task/editTask";

export function useHandleTaskStatusChange(
  task: TaskI | null,
  projectID: string,
  sectionID: string,
  checkboxRef: React.MutableRefObject<null>,
  setShowTask?: React.Dispatch<React.SetStateAction<boolean>>
) {
  const dispatch = useDispatch();

  return async function () {
    if (!task) return new Error("Task is null");

    const newStatus = task.status === "pending" ? "completed" : "pending";
    const animation = newStatus === "completed" ? "checking" : "unchecking";
    playAnimation(checkboxRef, animation, 300);
    const animationStart = Date.now();

    setTimeout(() => {
      if (setShowTask) setShowTask(false);
    }, 500);

    const timestamp = await getActualTimestamp();

    const newTask = { ...task };
    newTask.status = newStatus;
    newTask.timestamp = timestamp;

    const uploadNewTaskResult = await editTask(
      task,
      newTask,
      projectID,
      sectionID,
    );

    if (uploadNewTaskResult instanceof Error) return uploadNewTaskResult;

    const timeSinceAnimationStart = Date.now() - animationStart;
    const updateDelay =
      timeSinceAnimationStart >= 500 ? 0 : 500 - timeSinceAnimationStart;

    setTimeout(() => {
      dispatch(
        deleteTask({
          task,
          projectID,
          sectionID,
        })
      );

      dispatch(
        setTask({
          task: newTask,
          projectID,
          sectionID,
        })
      );
    }, updateDelay);

    return newTask;
  };
}
