import { getCurrentUser, db } from "../firebase";
import { doc, updateDoc, collection } from "firebase/firestore";

import { ProjectI } from "../../factories/project";

export async function editProject(project: ProjectI) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User has not logged in");

  const userId = user.uid;
  const userDataRef = doc(db, "users", userId);

  const projectSubCollectionRef = collection(userDataRef, "projects");
  const projectRef = doc(projectSubCollectionRef, project.id);

  await updateDoc(projectRef, {
    title: project.title,
  });

  return project;
}
