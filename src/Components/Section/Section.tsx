import { useState } from "react";

import { NewTaskboxObserver } from "../Project/Project";

import { SectionI } from "../../factories/section";
import { TaskI } from "../../factories/task";

import { ReactComponent as ArrowIcon } from "../../assets/arrow.svg";
import { ReactComponent as AddIcon } from "../../assets/add.svg";

import { Task } from "../Task/Task";
import { Taskbox } from "../Task/Taskbox/Taskbox";
import { SectionForm } from "./SectionForm";

import { CreateModal } from "../../utils/createModal";
import { TaskModal } from "../Task/TaskModal/TaskModal";
import { DeleteModal } from "../DeleteModal";

import { Dropdown } from "../Dropdown";
import { SectionOptionsButton } from "./SectionOptionsButton";
import { SectionOptionsDropdown } from "./SectionOptionsDropdown";

import { useDispatch } from "react-redux";
import { deleteSection as deleteSectionReducerAction } from "../../features/userDataSlice";

import { deleteSection } from "../../firebase/section/deleteSection";

interface sectionProps {
  section: SectionI;
  firstSectionID: string;
  showCompletedTasks: boolean;
  projectID: string;
  inboxID: string;
  addTaskboxIsEnabled: boolean;
  setAddTaskboxIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  sectionFormIsEnabled: boolean;
  setSectionFormIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  lastSectionID: string;
  setLastAddSectionBoxIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

function compareTasksDates(a: TaskI, b: TaskI) {
  const aDate = a.duedate === "" ? Infinity : new Date(a.duedate as string);
  const bDate = b.duedate === "" ? Infinity : new Date(b.duedate as string);

  const aTimestamp = a.timestamp;
  const bTimestamp = b.timestamp;

  if (aDate < bDate) {
    return -1;
  }

  if (aDate > bDate) {
    return 1;
  }

  if (aTimestamp < bTimestamp) {
    return -1;
  }

  if (aTimestamp > bTimestamp) {
    return 1;
  }

  return 0;
}

export const Section = ({
  section,
  firstSectionID,
  showCompletedTasks,
  projectID,
  inboxID,
  addTaskboxIsEnabled,
  setAddTaskboxIsEnabled,
  sectionFormIsEnabled,
  setSectionFormIsEnabled,
  lastSectionID,
  setLastAddSectionBoxIsEnabled,
}: sectionProps) => {
  const dispatch = useDispatch();

  const [showSection, setShowSection] = useState(true);
  const [showSectionContent, setShowSectionContent] = useState(true);
  const [showAddTaskbox, setShowAddTaskbox] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [showEditSectionForm, setShowEditSectionForm] = useState(false);

  const [task, setTask] = useState<TaskI | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteSectionModal, setShowDeleteSectionModal] = useState(false);

  function enableEditSectionForm() {
    setShowEditSectionForm(true);
  }

  function enableDeleteSectionModal() {
    setShowDeleteSectionModal(true);
  }

  async function deleteSectionAction() {
    setShowSection(false);
    setShowDeleteSectionModal(false);

    await deleteSection(projectID, section);

    setTimeout(() => {
      dispatch(
        deleteSectionReducerAction({
          projectID,
          sectionID: section.id,
        })
      );
    }, 200);
  }

  const deleteModal = CreateModal(
    DeleteModal,
    {
      elementType: "section",
      elementName: section.title,
      deleteAction: deleteSectionAction,
    },
    showDeleteSectionModal,
    setShowDeleteSectionModal,
    "overlay overlay-dark",
    200,
    true
  );

  const taskModal = CreateModal(
    TaskModal,
    { task, projectID, sectionID: section.id, inboxID },
    showTaskModal,
    setShowTaskModal,
    "overlay overlay-dark",
    200,
    true
  );

  function enableTaskModal(task: TaskI) {
    setTask(task);
    setShowTaskModal(true);
  }

  function disableTaskModal() {
    setShowTaskModal(false);
    setTimeout(() => {
      setTask(null);
    }, 200);
  }

  function enableTaskbox(
    taskboxType: "add" | "edit",
    taskboxSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    if (taskboxType === "add") setAddTaskboxIsEnabled(true);
    taskboxSetter(true);

    NewTaskboxObserver.notify(true);
  }

  function disableTaskbox(
    taskboxSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setAddTaskboxIsEnabled(false);
    taskboxSetter(false);
  }

  function enableAddSectionForm() {
    if (sectionFormIsEnabled) return;

    setSectionFormIsEnabled(true);
    setShowAddSectionForm(true);

    if (section.id === lastSectionID) setLastAddSectionBoxIsEnabled(true);
  }

  function disableAddSectionForm() {
    setSectionFormIsEnabled(false);
    setLastAddSectionBoxIsEnabled(false);
    setShowAddSectionForm(false);
  }

  const toggleShowSectionContent = () => {
    setShowSectionContent(!showSectionContent);
    if (showAddTaskbox) disableTaskbox(setShowAddTaskbox);
  };

  return (
    <>
      {deleteModal}

      {taskModal}

      {showSection && (
        <section className="project-section">
          {section.id !== firstSectionID && (
            <header className="project-section-header">
              {!showEditSectionForm ? (
                <>
                  <button
                    className="project-section-header-expand"
                    aria-label={
                      showSectionContent
                        ? "Hide section content"
                        : "Show section content"
                    }
                    data-expanded={showSectionContent}
                    onClick={toggleShowSectionContent}
                  >
                    <ArrowIcon />
                  </button>

                  <h3
                    onClick={() => {
                      setShowEditSectionForm(true);
                    }}
                  >
                    {section.title}
                  </h3>

                  <Dropdown
                    Button={SectionOptionsButton}
                    Dropdown={SectionOptionsDropdown}
                    DropdownProps={{
                      enableEditSectionForm,
                      enableDeleteSectionModal,
                    }}
                  />
                </>
              ) : (
                <SectionForm
                  disableSectionForm={() => {
                    setShowEditSectionForm(false);
                  }}
                  projectID={projectID}
                  section={section}
                />
              )}
            </header>
          )}

          <div
            className="project-section-content"
            data-visible={showSectionContent}
          >
            <ul className="project-section-tasks" aria-label="Tasks">
              {Object.values(section.tasks)
                .sort(compareTasksDates)
                .map((task) => {
                  return (
                    <li key={task.id}>
                      <Task
                        task={task}
                        enableTaskbox={enableTaskbox}
                        disableTaskbox={disableTaskbox}
                        enableTaskModal={enableTaskModal}
                        disableTaskModal={disableTaskModal}
                        projectID={projectID}
                        sectionID={section.id}
                        inboxID={inboxID}
                      />
                    </li>
                  );
                })}
            </ul>

            {!addTaskboxIsEnabled && (
              <button
                className="add-task-button"
                onClick={() => {
                  enableTaskbox("add", setShowAddTaskbox);
                }}
              >
                <div className="add-task-button-icon">
                  <AddIcon />
                </div>
                Add task
              </button>
            )}

            {showAddTaskbox && (
              <Taskbox
                showTaskbox={showAddTaskbox}
                disableTaskbox={() => {
                  disableTaskbox(setShowAddTaskbox);
                }}
                projectID={projectID}
                sectionID={section.id}
                inboxID={inboxID}
              />
            )}

            <ul
              className="project-section-completed-tasks"
              aria-label="Completed tasks"
            >
              {showCompletedTasks &&
                Object.values(section.completedTasks)
                  .sort(compareTasksDates)
                  .map((task) => {
                    return (
                      <li key={task.id}>
                        <Task
                          task={task}
                          enableTaskbox={enableTaskbox}
                          disableTaskbox={disableTaskbox}
                          enableTaskModal={enableTaskModal}
                          disableTaskModal={disableTaskModal}
                          projectID={projectID}
                          sectionID={section.id}
                          inboxID={inboxID}
                        />
                      </li>
                    );
                  })}
            </ul>

            <button
              className="add-section-button"
              aria-disabled={sectionFormIsEnabled}
              onClick={enableAddSectionForm}
            >
              <span>Add section</span>
            </button>
          </div>

          {showAddSectionForm && (
            <SectionForm
              disableSectionForm={disableAddSectionForm}
              projectID={projectID}
            />
          )}
        </section>
      )}
    </>
  );
};
