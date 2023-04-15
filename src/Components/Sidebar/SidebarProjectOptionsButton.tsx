import { DropdownButtonProps } from "../Dropdown";

import { ReactComponent as ElipsisFilled } from "../../assets/ellipsis-filled.svg";

interface SidebarProjectOptionsButton extends DropdownButtonProps {
  setProjectAsModalProject: () => void;
}

export const SidebarProjectOptionsButton = ({
  isActive,
  setIsActive,
  refProp,
  setProjectAsModalProject,
}: SidebarProjectOptionsButton) => {
  return (
    <button
      className="sidebar-project-options"
      onClick={(e) => {
        e.stopPropagation();
        setProjectAsModalProject();
        setIsActive(true);
      }}
      ref={refProp}
      data-active={isActive}
    >
      <ElipsisFilled />
    </button>
  );
};
