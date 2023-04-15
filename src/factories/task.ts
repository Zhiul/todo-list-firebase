import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";

export type priorityValue = "1" | "2" | "3" | "4";

export interface TaskI {
  title: string;
  description: string;
  priority: priorityValue;
  duedate: string | Timestamp;
  status: "pending" | "completed";
  timestamp: number | Timestamp;
  id: string;
}

export function Task(
  title: string,
  description: string,
  priority: priorityValue,
  duedate: string | Timestamp,
  status: "pending" | "completed",
  timestamp: number | Timestamp,
  id: string | null = null
) {
  id = id || uuidv4();

  return {
    title,
    description,
    priority,
    duedate,
    status,
    timestamp,
    id,
  };
}
