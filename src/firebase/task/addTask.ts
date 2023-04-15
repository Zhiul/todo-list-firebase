import { TaskI } from "../../factories/task";

import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getCurrentUser } from "../firebase";

export async function addTask(
  task: TaskI,
  projectID: string,
  sectionID: string
): Promise<TaskI | Error> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return new Error("User has not logged in");

    const taskRef = doc(
      db,
      "users",
      currentUser.uid,
      "projects",
      projectID,
      "sections",
      sectionID,
      "tasks",
      task.id
    );

    let duedate: string | Date = "";
    if (typeof task.duedate === "string") {
      if (task.duedate !== "") duedate = new Date(task.duedate);
    }

    await setDoc(taskRef, { ...task, duedate, timestamp: serverTimestamp() });

    return task;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}
