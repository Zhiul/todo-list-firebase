// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  query,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  getFirestore,
  getCountFromServer,
  setDoc,
  Timestamp,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

import { addProject } from "./project/addProject";

import { Project, ProjectI } from "../factories/project";

import { UserData, UserDataI } from "../factories/userData";
import { getActualTimestamp } from "../utils/getActualTimestamp";
import { SectionI } from "../factories/section";
import { TaskI } from "../factories/task";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyByIFHnQkMWp_GrmboDq_HVF8fNHpv5ii8",
  authDomain: "todolist-2d057.firebaseapp.com",
  projectId: "todolist-2d057",
  storageBucket: "todolist-2d057.appspot.com",
  messagingSenderId: "1006112784794",
  appId: "1:1006112784794:web:eb351211f4ca1c4ea53a23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
export const db = getFirestore();

// Firebase auth

const auth = getAuth();
let currentUser: "unknown" | User | null = "unknown";

export function initFirebaseAuth(callback: Function) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (currentUser !== "unknown") return currentUser;

  const fetchCurrentUser = (retries: number = 0): Promise<User | null> => {
    if (retries > 30) return Promise.reject(null);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (currentUser !== "unknown") {
          resolve(currentUser);
          return;
        }

        resolve(fetchCurrentUser(retries++));
      }, 50);
    });
  };

  const user = await fetchCurrentUser();
  return user;
};

export async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

export function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

// Retrieve user data

async function initializeUserData() {
  const user = await getCurrentUser();
  if (!user) throw new Error("User has not logged in");
  const userDataRef = doc(db, "users", user.uid);
  const userDataSnap = await getDoc(userDataRef);

  const timestamp = await getActualTimestamp();

  if (userDataSnap.exists() === false) {
    const project = Project("Inbox", {}, timestamp);
    await setDoc(userDataRef, { inboxID: project.id });
    await addProject(project);
  }
  return true;
}

export async function getUserData() {
  const user = await getCurrentUser();
  if (!user) return null;

  const userId = user.uid;
  let userDataRef = doc(db, "users", userId);
  let userDataSnap = await getDoc(userDataRef);

  if (userDataSnap.exists()) {
    // Adds inbox project in case it wasn't available
    const inboxID = userDataSnap.data().inboxID as string;

    const projectsCollection = collection(userDataRef, "projects");
    const projectsCollectionSnapshot = await getCountFromServer(
      projectsCollection
    );
    const projectsCollectionCount = projectsCollectionSnapshot.data().count;

    if (projectsCollectionCount === 0) {
      const timestamp = await getActualTimestamp();
      const project = Project("Inbox", {}, timestamp, inboxID);
      await addProject(project);
    }
  } else {
    await initializeUserData();
    userDataSnap = await getDoc(userDataRef);
  }

  // Transforms the user data fetched from the database to the schema used in app's state

  const userData = userDataSnap.data() as Omit<UserDataI, "projects">;

  const projectsQuery = query(collection(userDataRef, "projects"));
  const projectsSnapshot = await getDocs(projectsQuery);

  const projects: { [id: string]: ProjectI } = {};

  await Promise.all(
    projectsSnapshot.docs.map(async (doc) => {
      const project = (await doc.data()) as ProjectI;

      projects[project.id] = project;
      project.timestamp = (project.timestamp as Timestamp).seconds;

      const sectionsQuery = query(
        collection(userDataRef, "projects", project.id, "sections")
      );
      const sectionsSnapshot = await getDocs(sectionsQuery);

      const sections: { [id: string]: SectionI } = {};

      await Promise.all(
        sectionsSnapshot.docs.map(async (doc) => {
          const section = (await doc.data()) as SectionI;
          sections[section.id] = section;
          return true;
        })
      );

      project.sections = sections;

      for (const sectionID in project.sections) {
        const section = project.sections[sectionID];

        if (section.timestamp instanceof Timestamp)
          section.timestamp = section.timestamp.seconds;

        // Get tasks collection

        const tasksQuery = query(
          collection(
            userDataRef,
            "projects",
            project.id,
            "sections",
            section.id,
            "tasks"
          )
        );
        const tasksSnapshot = await getDocs(tasksQuery);

        const tasks: { [id: string]: TaskI } = {};

        await Promise.all(
          tasksSnapshot.docs.map(async (doc) => {
            const task = (await doc.data()) as TaskI;
            tasks[task.id] = task;
            return true;
          })
        );

        section.tasks = tasks;

        // Get completed tasks collection

        const completedTasksQuery = query(
          collection(
            userDataRef,
            "projects",
            project.id,
            "sections",
            section.id,
            "completedTasks"
          )
        );
        const completedTasksSnapshot = await getDocs(completedTasksQuery);

        const completedTasks: { [id: string]: TaskI } = {};

        await Promise.all(
          completedTasksSnapshot.docs.map(async (doc) => {
            const completedTask = (await doc.data()) as TaskI;
            completedTasks[completedTask.id] = completedTask;
            return true;
          })
        );

        section.completedTasks = completedTasks;

        for (const taskID in section.tasks) {
          const task = section.tasks[taskID];

          if (task.duedate instanceof Timestamp)
            task.duedate = (task.duedate as Timestamp).toDate().toISOString();
          if (task.timestamp instanceof Timestamp)
            task.timestamp = (task.timestamp as Timestamp).seconds;
        }

        for (const taskID in section.completedTasks) {
          const task = section.completedTasks[taskID];

          if (task.duedate instanceof Timestamp)
            task.duedate = (task.duedate as Timestamp).toDate().toISOString();
          if (task.timestamp instanceof Timestamp)
            task.timestamp = (task.timestamp as Timestamp).seconds;
        }
      }

      return true;
    })
  );

  return UserData(projects, userData.inboxID);
}
