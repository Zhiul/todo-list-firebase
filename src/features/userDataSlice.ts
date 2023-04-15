import { TaskI } from "../factories/task";
import { UserDataI } from "../factories/userData";

import { createSlice } from "@reduxjs/toolkit";
import { ProjectI } from "../factories/project";
import { SectionI } from "../factories/section";

type userDataState = UserDataI | null;

// Define the initial state using that type
const initialState = null as userDataState;

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    setProject(state, action) {
      const { project }: { project: ProjectI } = action.payload;

      if (state === null) return state;

      const projectRef = state.projects[project.id];

      if (projectRef) {
        projectRef.title = project.title;
      } else {
        state.projects[project.id] = project;
      }

      return state;
    },
    deleteProject(state, action) {
      const { projectID }: { projectID: string } = action.payload;

      if (state === null) return state;

      delete state.projects[projectID];

      return state;
    },
    setSection(state, action) {
      const { projectID, section }: { projectID: string; section: SectionI } =
        action.payload;

      if (state === null) return state;

      const project = state.projects[projectID];

      if (!project) return state;

      const sectionRef = project.sections[section.id];

      if (sectionRef) {
        sectionRef.title = section.title;
      } else {
        project.sections[section.id] = section;
      }

      return state;
    },
    deleteSection(state, action) {
      const { projectID, sectionID }: { projectID: string; sectionID: string } =
        action.payload;

      if (state === null) return state;

      const project = state.projects[projectID];

      if (!project) return state;

      delete project.sections[sectionID];

      return state;
    },
    setTask(state, action) {
      const {
        task,
        projectID,
        sectionID,
      }: { task: TaskI; projectID: string; sectionID: string } = action.payload;

      if (state === null) return state;

      const project = state.projects[projectID];

      if (!project) return state;

      const section = project.sections[sectionID];

      if (!section) return state;

      const taskLocation =
        task.status === "pending" ? "tasks" : "completedTasks";

      section[taskLocation][task.id] = task;

      return state;
    },
    deleteTask: (state, action) => {
      const { task, projectID, sectionID } = action.payload;
      if (state === null) return state;

      const project = state.projects[projectID];

      if (!project) return state;

      const section = project.sections[sectionID];

      if (!section) return state;

      const taskLocation =
        task.status === "pending" ? "tasks" : "completedTasks";

      delete section[taskLocation][task.id];

      return state;
    },
  },
});

export const {
  set,
  setProject,
  deleteProject,
  setSection,
  deleteSection,
  setTask,
  deleteTask,
} = userDataSlice.actions;
export default userDataSlice.reducer;
