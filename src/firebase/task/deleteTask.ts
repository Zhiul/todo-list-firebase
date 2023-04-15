import { TaskI } from "../../factories/task";

import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { getCurrentUser } from "../firebase";

export async function deleteTask(
  task: TaskI,
  projectID: string,
  sectionID: string
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return new Error("User has not logged in");

    const taskStatusLocation =
      task.status === "pending" ? "tasks" : "completedTasks";

    const taskRef = doc(
      db,
      "users",
      currentUser.uid,
      "projects",
      projectID,
      "sections",
      sectionID,
      taskStatusLocation,
      task.id
    );

    await deleteDoc(taskRef);

    return true;
  } catch (error) {
    return error as Error;
  }
}
