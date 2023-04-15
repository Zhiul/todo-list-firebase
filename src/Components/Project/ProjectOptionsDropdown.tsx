import { DropdownProps } from "../Dropdown";

import { ProjectOption } from "./ProjectOption";

import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as AddSectionIcon } from "../../assets/add-section.svg";
import { ReactComponent as Checkbox } from "../../assets/checkbox.svg";
import { ReactComponent as HideCompletedTasksIcon } from "../../assets/hide-completed-tasks-icon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

interface ProjectOptionsDropdownProps extends DropdownProps {
  projectID: string;
  inboxID: string;
  enableSetProjectModal: () => void;
  enableLastAddSectionBox: () => void;
  showCompletedTasks: boolean;
  toggleShowCompletedTasks: () => void;
  enableDeleteProjectModal: () => void;
}

export const ProjectOptionsDropdown = ({
  isActive,
  setIsActive,
  refProp,
  projectID,
  inboxID,
  enableSetProjectModal,
  enableLastAddSectionBox,
  showCompletedTasks,
  toggleShowCompletedTasks,
  enableDeleteProjectModal,
}: ProjectOptionsDropdownProps) => {
  return (
    <div className="dropdown" ref={refProp}>
      <ul
        className="project-dropdown-options"
        role="menu"
        aria-label="Project settings"
      >
        {projectID !== inboxID && (
          <>
            <ProjectOption
              text="Edit project"
              Icon={EditIcon}
              setIsActive={setIsActive}
              action={enableSetProjectModal}
            />

            <li className="project-dropdown-separator" aria-hidden="true"></li>
          </>
        )}

        <ProjectOption
          text="Add section"
          Icon={AddSectionIcon}
          setIsActive={setIsActive}
          action={enableLastAddSectionBox}
        />

        <li className="project-dropdown-separator" aria-hidden="true"></li>

        <ProjectOption
          text={showCompletedTasks ? "Hide completed" : "Show completed"}
          Icon={showCompletedTasks ? HideCompletedTasksIcon : Checkbox}
          setIsActive={setIsActive}
          action={toggleShowCompletedTasks}
        />

        <li className="project-dropdown-separator" aria-hidden="true"></li>

        {projectID !== inboxID && (
          <>
            <ProjectOption
              text="Delete project"
              Icon={DeleteIcon}
              setIsActive={setIsActive}
              action={enableDeleteProjectModal}
            />
          </>
        )}
      </ul>
    </div>
  );
};
