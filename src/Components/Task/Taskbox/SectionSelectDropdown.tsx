import { ProjectI } from "../../../factories/project";

import { compareTimestamps } from "../../../utils/compareTimestamps";

import { DropdownProps } from "../../Dropdown";
import { TaskLocation } from "./Taskbox";

import { SectionSelectDropdownOption } from "./SectionSelectDropdownOption";

interface SectionSelectDropdownProps extends DropdownProps {
  projects: { [id: string]: ProjectI };
  inboxID: string;
  taskLocation: TaskLocation;
  setNewTaskLocation: (newTaskLocation: TaskLocation) => void;
}

export const SectionSelectDropdown = ({
  isActive,
  setIsActive,
  projects,
  inboxID,
  taskLocation,
  setNewTaskLocation,
  refProp,
}: SectionSelectDropdownProps) => {
  return (
    <div className="dropdown" ref={refProp}>
      <ul className="section-select" role="listbox">
        {Object.values(projects)
          .sort(compareTimestamps)
          .map((project) => {
            return (
              <div key={project.id}>
                {Object.values(project.sections)
                  .sort(compareTimestamps)
                  .map((section) => {
                    return (
                      <li key={section.id}>
                        <SectionSelectDropdownOption
                          setIsActive={setIsActive}
                          projectID={project.id}
                          sectionID={section.id}
                          firstSectionID={project.firstSectionID}
                          taskLocation={taskLocation}
                          setNewTaskLocation={setNewTaskLocation}
                          inboxID={inboxID}
                        />
                      </li>
                    );
                  })}
              </div>
            );
          })}
      </ul>
    </div>
  );
};
