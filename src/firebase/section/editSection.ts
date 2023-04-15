import { db } from "../firebase";
import { doc, collection, updateDoc } from "firebase/firestore";
import { getCurrentUser } from "../firebase";
import { SectionI } from "../../factories/section";

export async function editSection(
  projectID: string,
  section: SectionI,
  title: string
): Promise<SectionI | Error> {
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

    await updateDoc(sectionRef, {
      title,
    });
    return section;
  } catch (error) {
    return error as Error;
  }
}
