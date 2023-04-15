import { Section, SectionI } from "./section";
import { v4 as uuidv4, v4 } from "uuid";
import { Timestamp } from "firebase/firestore";

export interface ProjectI {
  title: string;
  sections: {
    [id: string]: SectionI;
  };
  timestamp: number | Timestamp;
  id: string;
  firstSectionID: string;
}

export function Project(
  title: string,
  sections: {
    [id: string]: SectionI;
  } = {},
  timestamp: number | Timestamp,
  id: string | null = null
) {
  const section = Section("", timestamp);
  sections[section.id] = section;
  const firstSectionID = section.id;

  id = id || uuidv4();

  return {
    title,
    sections,
    timestamp,
    id,
    firstSectionID,
  };
}
