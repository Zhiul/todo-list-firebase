import { db } from "../firebase";
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { getCurrentUser } from "../firebase";
import { SectionI } from "../../factories/section";

export async function addSection(
  projectID: string,
  section: SectionI
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

    await setDoc(sectionRef, {
      title: section.title,
      timestamp: serverTimestamp(),
      id: section.id,
    });

    return section;
  } catch (error) {
    return error as Error;
  }
}
