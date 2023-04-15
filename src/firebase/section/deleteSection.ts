import { db } from "../firebase";
import { doc, collection, deleteDoc } from "firebase/firestore";
import { getCurrentUser } from "../firebase";
import { SectionI } from "../../factories/section";

export async function deleteSection(projectID: string, section: SectionI) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return new Error("User has not logged in");

    const projectSectionsSubcollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "projects",
      projectID,
      "sections"
    );
    const sectionRef = doc(projectSectionsSubcollectionRef, section.id);

    await deleteDoc(sectionRef);

    return true;
  } catch (error) {
    return error as Error;
  }
}
