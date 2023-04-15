import { useState } from "react";

import { Section } from "../Section/Section";

import { ProjectI } from "../../factories/project";
import { Observable } from "../../utils/observable";
import { compareTimestamps } from "../../utils/compareTimestamps";

import { CreateModal } from "../../utils/createModal";
import { SetProjectModal } from "./SetProjectModal";
import { DeleteModal } from "../DeleteModal";

import { Dropdown } from "../Dropdown";
import { ProjectOptionsButton } from "./ProjectOptionsButton";
import { ProjectOptionsDropdown } from "./ProjectOptionsDropdown";

import { useDeleteProjectAction } from "./useDeleteProjectAction";

export const NewTaskboxObserver = new Observable();
export const NewAddSectionBoxObserver = new Observable();

interface ProjectProps {
  project: ProjectI;
  inboxID: string;
  setCurrentProjectID: React.Dispatch<React.SetStateAction<string>>;
}

export const Project = ({
  project,
  inboxID,
  setCurrentProjectID,
}: ProjectProps) => {
  const sectionsCollection = Object.values(project.sections).sort(
    compareTimestamps
  );
  const lastSectionID = sectionsCollection[sectionsCollection.length - 1].id;

  const [addTaskboxIsEnabled, setAddTaskboxIsEnabled] = useState(false);
  const [sectionFormIsEnabled, setSectionFormIsEnabled] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [lastAddSectionBoxIsEnabled, setLastAddSectionBoxIsEnabled] =
    useState(false);

  const [showSetProjectModal, setShowSetProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  const setProjectModal = CreateModal(
    SetProjectModal,
    { project },
    showSetProjectModal,
    setShowSetProjectModal,
    "overlay overlay-dark",
    200,
    true
  );

  const deleteProjectAction = useDeleteProjectAction(
    project,
    inboxID,
    setShowDeleteProjectModal,
    project.id,
    setCurrentProjectID
  );

  const deleteProjectModal = CreateModal(
    DeleteModal,
    {
      elementType: "project",
      elementName: project.title,
      deleteAction: deleteProjectAction,
    },
    showDeleteProjectModal,
    setShowDeleteProjectModal,
    "overlay overlay-dark",
    200,
    true
  );

  function enableSetProjectModal() {
    setShowSetProjectModal(true);
  }

  function enableLastAddSectionBox() {
    if (lastAddSectionBoxIsEnabled) return;

    NewAddSectionBoxObserver.notify(true);
    setLastAddSectionBoxIsEnabled(true);

    // Enables last add section box in next render

    setTimeout(() => {
      const mainElement = document.querySelector("main") as HTMLElement;

      const addSectionButtons = document.querySelectorAll(
        ".add-section-button"
      ) as NodeListOf<HTMLButtonElement>;
      const lastAddSectionButton =
        addSectionButtons[addSectionButtons.length - 1];

      lastAddSectionButton.click();

      // Scrolls main to the bottom after section box is rendered

      setTimeout(() => {
        mainElement.scrollTo(0, mainElement.scrollHeight);
      }, 0);
    }, 0);
  }

  function toggleShowCompletedTasks() {
    setShowCompletedTasks(!showCompletedTasks);
  }

  function enableDeleteProjectModal() {
    setShowDeleteProjectModal(true);
  }

  return (
    <>
      {setProjectModal}
      {deleteProjectModal}

      {project && (
        <main className="project">
          <div className="project-header-wrapper">
            <header className="project-header">
              <h2>
                <span className="sr-only">Project: </span>
                {project.title}
              </h2>

              <div className="project-header-buttons">
                <Dropdown
                  Button={ProjectOptionsButton}
                  Dropdown={ProjectOptionsDropdown}
                  DropdownProps={{
                    projectID: project.id,
                    inboxID,
                    enableSetProjectModal,
                    enableLastAddSectionBox,
                    showCompletedTasks,
                    toggleShowCompletedTasks,
                    enableDeleteProjectModal,
                  }}
                />
              </div>
            </header>
          </div>

          <h3 className="sr-only" id="sections">
            Sections
          </h3>

          <ul className="project-sections" aria-labelledby="sections">
            {sectionsCollection.map((section) => {
              return (
                <li key={section.id}>
                  <Section
                    section={section}
                    firstSectionID={project.firstSectionID}
                    projectID={project.id}
                    inboxID={inboxID}
                    showCompletedTasks={showCompletedTasks}
                    addTaskboxIsEnabled={addTaskboxIsEnabled}
                    setAddTaskboxIsEnabled={setAddTaskboxIsEnabled}
                    sectionFormIsEnabled={sectionFormIsEnabled}
                    setSectionFormIsEnabled={setSectionFormIsEnabled}
                    lastSectionID={lastSectionID}
                    setLastAddSectionBoxIsEnabled={
                      setLastAddSectionBoxIsEnabled
                    }
                  />
                </li>
              );
            })}
          </ul>
        </main>
      )}
    </>
  );
};
