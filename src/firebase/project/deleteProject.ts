import { getCurrentUser, db } from "../firebase";
import { doc, deleteDoc, collection } from "firebase/firestore";

import { ProjectI } from "../../factories/project";

export async function deleteProject(project: ProjectI) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User has not logged in");

  const userId = user.uid;
  const userDataRef = doc(db, "users", userId);

  const projectsCollectionRef = collection(userDataRef, "projects");
  const projectRef = doc(projectsCollectionRef, project.id);

  await deleteDoc(projectRef);

  return true;
}
