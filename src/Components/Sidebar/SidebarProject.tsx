import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as InboxIcon } from "../../assets/inbox.svg";
import { ProjectI } from "../../factories/project";

import { Dropdown } from "../Dropdown";
import { SidebarProjectOptionsDropdown } from "./SidebarProjectOptionsDropdown";
import { SidebarProjectOptionsButton } from "./SidebarProjectOptionsButton";

interface SidebarProjectProps {
  type: "normal" | "inbox";
  project: ProjectI;
  modalProject: ProjectI | null;
  setModalProject: React.Dispatch<React.SetStateAction<ProjectI | null>>;
  clearModalProject: (timeout: number) => void;

  enableSetProjectModal: React.Dispatch<React.SetStateAction<boolean>>;

  enableDeleteProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectModalIsEnabled: boolean;

  currentProjectID: string;
  setCurrentProjectID: React.Dispatch<React.SetStateAction<string>>;
  inboxID: string;
}

export const SidebarProject = ({
  type,
  project,
  modalProject,
  setModalProject,
  enableSetProjectModal,
  enableDeleteProjectModal,
  projectModalIsEnabled,
  currentProjectID,
  setCurrentProjectID,
  inboxID,
}: SidebarProjectProps) => {
  const navigate = useNavigate();
  const [showSidebarProjectOptions, setShowSidebarProjectOptions] =
    useState(false);
  const isCurrentProject = project.id === currentProjectID;

  let projectIcon;

  if (type === "inbox") {
    projectIcon = <InboxIcon />;
  } else {
    projectIcon = <div className="project-icon-circle"></div>;
  }

  const tasksNumber = Object.values(project.sections).reduce(
    (prevTasksNumber, currentSection) =>
      prevTasksNumber + Object.keys(currentSection.tasks).length,
    0
  );

  function setAsCurrentProject() {
    const projectID = project.id === inboxID ? "inbox" : project.id;
    navigate(`/app/${projectID}`);
    setCurrentProjectID(project.id);
  }

  function setAsModalProject() {
    setModalProject(project);
  }

  return (
    <div
      className="sidebar-project"
      role="link"
      tabIndex={0}
      aria-current={isCurrentProject ? "page" : undefined}
      data-type={type}
      data-is-modal-project={
        modalProject?.id === project.id && showSidebarProjectOptions
      }
      onClick={setAsCurrentProject}
    >
      <div className="sidebar-project-title">
        <div className="project-icon">{projectIcon}</div>
        <div className="sidebar-project-title-container">
          <h3>{project.title}</h3>
          <span className="sr-only">project, </span>
        </div>
      </div>

      <div className="sidebar-project-right-section">
        <div className="project-tasks-number">
          <span className="sr-only">with</span>
          <span className={!tasksNumber ? "sr-only" : ""}>{tasksNumber}</span>
          <span className="sr-only">tasks</span>
        </div>

        {project.id !== inboxID && (
          <Dropdown
            Button={SidebarProjectOptionsButton}
            Dropdown={SidebarProjectOptionsDropdown}
            DropdownProps={{
              projectID: currentProjectID,
              inboxID,
              projectModalIsEnabled,
              enableSetProjectModal,
              enableDeleteProjectModal,
            }}
            ButtonProps={{
              setProjectAsModalProject: setAsModalProject,
            }}
            isActiveProp={showSidebarProjectOptions}
            setIsActiveProp={setShowSidebarProjectOptions}
          />
        )}
      </div>
    </div>
  );
};
