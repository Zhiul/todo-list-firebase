import { TaskI } from "./task";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";

export interface SectionI {
  title: string;
  timestamp: number | Timestamp;
  tasks: {
    [id: string]: TaskI;
  };
  completedTasks: {
    [id: string]: TaskI;
  };
  id: string;
}

export function Section(
  title: string = "",
  timestamp: number | Timestamp,
  tasks: {
    [id: string]: TaskI;
  } = {},
  completedTasks: {
    [id: string]: TaskI;
  } = {},
  id: string | null = null
) {
  id = null || uuidv4();

  return {
    title,
    tasks,
    completedTasks,
    id,
    timestamp,
  };
}
