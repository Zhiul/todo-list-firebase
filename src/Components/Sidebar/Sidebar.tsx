import { useEffect, useState } from "react";

import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";

import { SidebarProject } from "./SidebarProject";

import { ProjectI } from "../../factories/project";
import { compareTimestamps } from "../../utils/compareTimestamps";

import { CreateModal } from "../../utils/createModal";
import { SetProjectModal } from "../Project/SetProjectModal";
import { DeleteModal } from "../DeleteModal";
import { useDeleteProjectAction } from "../Project/useDeleteProjectAction";

interface SidebarProps {
  projects: {
    [id: string]: ProjectI;
  };
  inboxID: string;
  showSidebar: boolean;
  toggleSidebar: () => void;
  currentProjectID: string;
  setCurrentProjectID: React.Dispatch<React.SetStateAction<string>>;
}

export const Sidebar = ({
  projects,
  inboxID,
  showSidebar,
  toggleSidebar,
  currentProjectID,
  setCurrentProjectID,
}: SidebarProps) => {
  const projectsCollection = Object.values(projects).sort(compareTimestamps);

  const [showSidebarProjects, setShowSidebarProjects] = useState(false);
  const toggleShowSidebarProjects = () =>
    setShowSidebarProjects(!showSidebarProjects);

  // The modal project state is passed down as a property to the project modals

  const [modalProject, setModalProject] = useState<ProjectI | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const projectModalIsEnabled = showProjectModal || showDeleteProjectModal;

  function clearModalProject(timeout: number) {
    if (timeout === 0) {
      setModalProject(null);
    } else {
      setTimeout(() => {
        setModalProject(null);
      }, timeout);
    }
  }

  useEffect(() => {
    if (projectModalIsEnabled === false && modalProject) clearModalProject(200);
  }, [showProjectModal, showDeleteProjectModal]);

  const projectModal = CreateModal(
    SetProjectModal,
    { project: modalProject },
    showProjectModal,
    setShowProjectModal,
    "overlay overlay-dark",
    200,
    true
  );

  function enableSetProjectModal() {
    setShowProjectModal(true);
  }

  const deleteProjectAction = useDeleteProjectAction(
    modalProject,
    inboxID,
    setShowDeleteProjectModal,
    currentProjectID,
    setCurrentProjectID
  );

  const deleteProjectModal = CreateModal(
    DeleteModal,
    {
      elementType: "project",
      elementName: modalProject?.title || "",
      deleteAction: deleteProjectAction,
    },
    showDeleteProjectModal,
    setShowDeleteProjectModal,
    "overlay overlay-dark",
    200,
    true
  );

  function enableDeleteProjectModal() {
    setShowDeleteProjectModal(true);
  }

  return (
    <>
      {projectModal}
      {deleteProjectModal}

      {projects && (
        <>
          <div
            className="sidebar"
            aria-label="Sidebar"
            data-active={showSidebar}
          >
            <nav aria-label="Default projects">
              <ul>
                <li key={inboxID}>
                  <SidebarProject
                    type="inbox"
                    project={projects[inboxID]}
                    modalProject={modalProject}
                    setModalProject={setModalProject}
                    clearModalProject={clearModalProject}
                    projectModalIsEnabled={projectModalIsEnabled}
                    enableSetProjectModal={enableSetProjectModal}
                    enableDeleteProjectModal={enableDeleteProjectModal}
                    currentProjectID={currentProjectID}
                    setCurrentProjectID={setCurrentProjectID}
                    inboxID={inboxID}
                  />
                </li>
              </ul>
            </nav>

            <div className="sidebar-projects-toggle">
              <h2>Projects</h2>

              <div className="sidebar-project-toggle-buttons">
                <button
                  className="sidebar-project-toggle-btn"
                  aria-label="Add a project"
                  onClick={() => {
                    setShowProjectModal(true);
                  }}
                >
                  <AddIcon />
                </button>

                <button
                  className="sidebar-project-toggle-btn sidebar-projects-expand"
                  aria-label={
                    showSidebarProjects ? "Hide projects" : "Show projects"
                  }
                  aria-expanded={showSidebarProjects}
                  onClick={toggleShowSidebarProjects}
                >
                  <ArrowIcon />
                </button>
              </div>
            </div>

            <nav aria-label="Projects">
              <ul
                className="sidebar-projects"
                data-enabled={showSidebarProjects}
              >
                {projectsCollection.map((project) => {
                  if (project.id === inboxID) return null;

                  return (
                    <li key={project.id}>
                      <SidebarProject
                        type="normal"
                        project={projects[project.id]}
                        modalProject={modalProject}
                        setModalProject={setModalProject}
                        projectModalIsEnabled={projectModalIsEnabled}
                        clearModalProject={clearModalProject}
                        enableSetProjectModal={enableSetProjectModal}
                        enableDeleteProjectModal={enableDeleteProjectModal}
                        currentProjectID={currentProjectID}
                        setCurrentProjectID={setCurrentProjectID}
                        inboxID={inboxID}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div
            className="overlay overlay-dark sidebar-overlay"
            onClick={toggleSidebar}
          ></div>
        </>
      )}
    </>
  );
};
