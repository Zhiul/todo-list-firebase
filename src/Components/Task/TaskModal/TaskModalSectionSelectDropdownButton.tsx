import { TaskLocation } from "../Taskbox/Taskbox";

import { ReactComponent as InboxIcon } from "../../../assets/inbox.svg";
import { ReactComponent as ArrowIcon } from "../../../assets/arrow.svg";
import { DropdownButtonProps } from "../../Dropdown";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface TaskModalSectionSelectDropdownButtonProps
  extends DropdownButtonProps {
  taskLocation: TaskLocation;
  currentFirstSectionLocationID: string;
  inboxID: string;
}

export const TaskModalSectionSelectDropdownButton = ({
  setIsActive,
  taskLocation,
  currentFirstSectionLocationID,
  inboxID,
  refProp,
}: TaskModalSectionSelectDropdownButtonProps) => {
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
      className="task-in-modal-parameter"
      type="button"
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <div className="task-in-modal-parameter-icon">{projectIcon}</div>

      <div className="section-select-button-title-wrapper">
        <span className="sr-only">Task location: </span>

        <span className="sr-only">Project: </span>
        <div className="task-in-modal-parameter-text">{projectTitle}</div>

        {currentFirstSectionLocationID !== taskLocation.sectionID && (
          <>
            <div
              className="section-select-button-title-separator"
              aria-hidden="true"
            >
              /
            </div>

            <span className="sr-only">Section: </span>
            <div className="task-in-modal-parameter-text">{sectionTitle}</div>
          </>
        )}
      </div>

      <div className="section-select-arrow">
        <ArrowIcon />
      </div>
    </button>
  );
};
