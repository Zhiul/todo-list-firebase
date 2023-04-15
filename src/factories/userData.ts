import { ProjectI } from "./project";

export interface UserDataI {
  projects: {
    [id: string]: ProjectI;
  };
  inboxID: string;
}

export function UserData(
  projects: {
    [id: string]: ProjectI;
  },
  inboxID: string
) {
  return { projects, inboxID };
}
