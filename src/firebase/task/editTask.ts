import { TaskI } from "../../factories/task";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getCurrentUser } from "../firebase";

export async function editTask(
  task: TaskI,
  newTask: TaskI,
  projectID: string,
  sectionID: string,
  newProjectID: string = projectID,
  newSectionID: string = sectionID
): Promise<TaskI | Error> {
  try {
    debugger;
    const currentUser = await getCurrentUser();
    if (!currentUser) return new Error("User has not logged in");

    const previousStatusLocation =
      task.status === "pending" ? "tasks" : "completedTasks";
    const newStatusLocation =
      newTask.status === "pending" ? "tasks" : "completedTasks";

    const taskIsPlacedInNewLocation =
      previousStatusLocation !== newStatusLocation ||
      projectID !== newProjectID ||
      sectionID !== newSectionID;

    const previousTaskRef = doc(
      db,
      "users",
      currentUser.uid,
      "projects",
      projectID,
      "sections",
      sectionID,
      previousStatusLocation,
      task.id
    );

    const taskRef = doc(
      db,
      "users",
      currentUser.uid,
      "projects",
      newProjectID,
      "sections",
      newSectionID,
      newStatusLocation,
      task.id
    );

    let duedate: string | Date = "";
    if (typeof newTask.duedate === "string") {
      if (newTask.duedate !== "") duedate = new Date(newTask.duedate);
    }

    if (taskIsPlacedInNewLocation) {
      await deleteDoc(previousTaskRef);

      await setDoc(taskRef, {
        ...newTask,
        duedate,
        timestamp: serverTimestamp(),
      });
    } else {
      await updateDoc(previousTaskRef, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        duedate,
        status: newTask.status,
      });
    }

    return newTask;
  } catch (error) {
    console.error(error);
    return error as Error;
  }
}
