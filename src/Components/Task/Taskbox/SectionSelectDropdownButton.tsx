import { TaskLocation } from "./Taskbox";

import { ReactComponent as InboxIcon } from "../../../assets/inbox.svg";
import { ReactComponent as SectionIcon } from "../../../assets/section.svg";
import { ReactComponent as ArrowIcon } from "../../../assets/triangle-arrow.svg";
import { DropdownButtonProps } from "../../Dropdown";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface SectionSelectDropdownButtonProps extends DropdownButtonProps {
  taskLocation: TaskLocation;
  currentFirstSectionLocationID: string;
  inboxID: string;
}

export const SectionSelectDropdownButton = ({
  setIsActive,
  taskLocation,
  currentFirstSectionLocationID,
  inboxID,
  refProp,
}: SectionSelectDropdownButtonProps) => {
  const projectTitle = useSelector(
    (state: RootState) => state.userData?.projects[taskLocation.projectID].title
  );

  const sectionTitle = useSelector(
    (state: RootState) =>
      state.userData?.projects[taskLocation.projectID].sections[
        taskLocation.sectionID
      ].title
  );

  let projectIcon;

  if (taskLocation.projectID === inboxID) {
    projectIcon = <InboxIcon />;
  } else {
    projectIcon = <div className="project-icon-circle"></div>;
  }

  return (
    <button
      className="section-select-button"
      type="button"
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <span className="sr-only">Task location: </span>

      <div className="section-select-button-title-wrapper">
        <div className="section-select-button-title">
          <div className="section-select-button-title-icon">{projectIcon}</div>
          <span className="sr-only">Project: </span>
          <div className="section-select-button-title-text">{projectTitle}</div>
        </div>

        {currentFirstSectionLocationID !== taskLocation.sectionID && (
          <>
            <div className="section-select-button-title-separator">/</div>

            <div className="section-select-button-title">
              <div className="section-select-button-title-icon">
                <SectionIcon />
              </div>
              <span className="sr-only">Section: </span>
              <div className="section-select-button-title-text">
                {sectionTitle}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="section-select-arrow">
        <ArrowIcon />
      </div>
    </button>
  );
};
