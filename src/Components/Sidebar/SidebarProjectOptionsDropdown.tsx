import { useEffect } from "react";
import { DropdownProps } from "../Dropdown";

import { ProjectOption } from "../Project/ProjectOption";

import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

interface SidebarOptionsDropdownProps extends DropdownProps {
  projectID: string;
  inboxID: string;
  enableSetProjectModal: () => void;
  enableDeleteProjectModal: () => void;
}

export const SidebarProjectOptionsDropdown = ({
  isActive,
  setIsActive,
  refProp,
  enableSetProjectModal,
  enableDeleteProjectModal,
}: SidebarOptionsDropdownProps) => {
  useEffect(() => {}, [isActive]);

  return (
    <div className="dropdown" ref={refProp}>
      <ul className="project-dropdown-options" role="menu">
        <ProjectOption
          text="Edit project"
          Icon={EditIcon}
          setIsActive={setIsActive}
          action={enableSetProjectModal}
        />

        <ProjectOption
          text="Delete project"
          Icon={DeleteIcon}
          setIsActive={setIsActive}
          action={enableDeleteProjectModal}
        />
      </ul>
    </div>
  );
};
