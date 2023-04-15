import { getCurrentUser, db } from "../firebase";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";

import { ProjectI } from "../../factories/project";

export async function addProject(project: ProjectI) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User has not logged in");

  const userId = user.uid;
  const userDataRef = doc(db, "users", userId);

  const projectsCollectionRef = collection(userDataRef, "projects");
  const projectRef = doc(projectsCollectionRef, project.id);
  const projectSectionsSubcollection = collection(projectRef, "sections");

  const projectFirstSection = project.sections[project.firstSectionID];
  const projectFirstSectionRef = doc(
    projectSectionsSubcollection,
    projectFirstSection.id
  );

  await setDoc(projectRef, {
    title: project.title,
    timestamp: serverTimestamp(),
    id: project.id,
    firstSectionID: projectFirstSection.id,
  });
  await setDoc(projectFirstSectionRef, {
    title: projectFirstSection.title,
    timestamp: serverTimestamp(),
    id: projectFirstSection.id,
  });

  return project;
}
