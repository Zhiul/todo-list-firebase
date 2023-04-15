import { DropdownButtonProps } from "../../Dropdown";
import { TaskLocation } from "./Taskbox";

import { ReactComponent as InboxIcon } from "../../../assets/inbox.svg";
import { ReactComponent as SectionIcon } from "../../../assets/section.svg";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface SectionSelectDropdownOptionProps {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  projectID: string;
  sectionID: string;
  firstSectionID: string;
  taskLocation: TaskLocation;
  setNewTaskLocation: (newTaskLocation: TaskLocation) => void;
  inboxID: string;
}

export const SectionSelectDropdownOption = ({
  setIsActive,
  projectID,
  sectionID,
  firstSectionID,
  taskLocation,
  setNewTaskLocation,
  inboxID,
}: SectionSelectDropdownOptionProps) => {
  const projectTitle = useSelector(
    (state: RootState) => state.userData?.projects[projectID].title
  );

  const sectionTitle = useSelector(
    (state: RootState) =>
      state.userData?.projects[projectID].sections[sectionID].title
  );

  const type = sectionID === firstSectionID ? "project" : "section";

  let optionIcon;
  let optionIconType;

  if (type === "project") {
    if (projectID === inboxID) {
      optionIcon = <InboxIcon />;
      optionIconType = "inbox";
    } else {
      optionIcon = <div className="project-icon-circle"></div>;
      optionIconType = "project";
    }
  } else {
    optionIcon = <SectionIcon />;
    optionIconType = "section";
  }

  const title = sectionID === firstSectionID ? projectTitle : sectionTitle;

  return (
    <div
      className="section-select-dropdown-option"
      role="option"
      onClick={() => {
        setNewTaskLocation({ projectID, sectionID });
        setIsActive(false);
      }}
      data-type={type}
    >
      <div
        className="section-select-dropdown-option-icon"
        data-type={optionIconType}
      >
        {optionIcon}
      </div>
      <div className="section-select-dropdown-option-text">{title}</div>
    </div>
  );
};
