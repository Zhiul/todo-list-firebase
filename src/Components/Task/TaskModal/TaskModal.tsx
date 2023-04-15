import { UserDataI } from "../../../factories/userData";
import { TaskLocation } from "../Taskbox/Taskbox";
import { useState, useRef, useEffect } from "react";

import { ReactComponent as InboxIcon } from "../../../assets/inbox.svg";
import { ReactComponent as SectionIcon } from "../../../assets/section.svg";

import { ReactComponent as CloseIcon } from "../../../assets/close.svg";
import { ReactComponent as CheckmarkIcon } from "../../../assets/check-mark.svg";

import { TaskI } from "../../../factories/task";

import { useModalAnimation } from "../../../utils/useModalAnimation";

import "remirror/styles/all.css";
import { BoldExtension, PlaceholderExtension } from "remirror/extensions";
import {
  Remirror,
  useRemirror,
  UseRemirrorReturn,
  ReactFrameworkOutput,
  ReactExtensions,
} from "@remirror/react";
import { RemirrorEventListenerProps } from "@remirror/core";

import { Dropdown } from "../../Dropdown";
import { TaskModalPriorityButton } from "./TaskModalPriorityButton";
import { PriorityDropdown } from "../Taskbox/PriorityDropdown";
import { TaskModalDuedateButton } from "./TaskModalDuedateButton";
import { DuedateDropdown } from "../Taskbox/DuedateDropdown";

import { TaskModalSectionSelectDropdownButton } from "./TaskModalSectionSelectDropdownButton";
import { SectionSelectDropdown } from "../Taskbox/SectionSelectDropdown";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { setTask, deleteTask } from "../../../features/userDataSlice";

import { Task } from "../../../factories/task";

import { editTask } from "../../../firebase/task/editTask";
import { useHandleTaskStatusChange } from "../useHandleTaskStatusChange";

import { isEqual } from "lodash";

interface TaskModalProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskI | null;
  projectID: string;
  sectionID: string;
  inboxID: string;
}

const createProseMirrorDoc = (text: string) => {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text,
          },
        ],
      },
    ],
  };
};

export const TaskModal = ({
  isActive,
  setIsActive,
  task,
  projectID,
  sectionID,
  inboxID,
}: TaskModalProps) => {
  const dispatch = useDispatch();

  const taskModalRef = useRef(null);
  useModalAnimation(taskModalRef, isActive, true);

  const [showTaskbox, setShowTaskbox] = useState(false);

  const [originalTask, setOriginalTask] = useState(task);

  const checkboxRef = useRef(null);

  // Taskbox inputs

  const [allowUpload, setAllowUpload] = useState(true);
  const [priority, setPriority] = useState(task?.priority || "4");
  const [duedate, setDuedate] = useState(task?.duedate || "");
  const [prevTaskLocation, setPrevTaskLocation] = useState<TaskLocation>({
    projectID,
    sectionID,
  });
  const [taskLocation, setTaskLocation] = useState<TaskLocation>({
    projectID,
    sectionID,
  });

  const handleTaskStatusChange = useHandleTaskStatusChange(
    originalTask,
    taskLocation.projectID,
    taskLocation.sectionID,
    checkboxRef
  );

  const setNewTaskLocation = (newTaskLocation: TaskLocation) => {
    setPrevTaskLocation(taskLocation);
    setTaskLocation(newTaskLocation);
  };

  const [handlingTaskStatusChange, setHandlingTaskStatusChange] =
    useState(false);

  // Task location

  const projects = useSelector(
    (state: RootState) => (state.userData as UserDataI).projects
  );

  const projectTitle = useSelector(
    (state: RootState) =>
      (state.userData as UserDataI).projects[taskLocation.projectID].title
  );

  const sectionTitle = useSelector(
    (state: RootState) =>
      (state.userData as UserDataI).projects[taskLocation.projectID].sections[
        taskLocation.sectionID
      ].title
  );

  // Text inputs

  const taskTitle = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Task name` }),
    ],
    content: `<p>${task ? task.title : ""}</p>`,
    stringHandler: "html",
  });
  const [previousTaskTitle, setPreviousTaskTitle] = useState("");

  const taskTitleMaxLength = 500;

  const taskDescription = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Description` }),
    ],
    content: `<p>${task ? task.description : ""}</p>`,
    stringHandler: "html",
  });

  const taskTitleValue = getInputValue(taskTitle);
  const taskDescriptionValue = getInputValue(taskDescription);

  const [previousTaskDescription, setPreviousTaskDescription] = useState("");

  const taskDescriptionMaxLength = 16368;

  const [textInputError, setTextInputError] = useState("");
  const textInputErrorTimeoutRef: React.MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);

  function getInputValue(
    input: UseRemirrorReturn<
      ReactExtensions<BoldExtension | PlaceholderExtension>
    >
  ) {
    return input.getContext()
      ? (
          input.getContext() as ReactFrameworkOutput<
            ReactExtensions<BoldExtension | PlaceholderExtension>
          >
        ).helpers.getText()
      : "";
  }

  function handleTextInput(
    parameter: RemirrorEventListenerProps<Remirror.Extensions>,
    inputType: string,
    inputMaxLength: number
  ) {
    const taskTitleValue = getInputValue(taskTitle);
    const taskDescriptionValue = getInputValue(taskDescription);

    const allowUpload =
      taskTitleValue.length >= 1 &&
      taskTitleValue.length <= taskTitleMaxLength &&
      taskDescriptionValue.length <= taskDescriptionMaxLength;

    setAllowUpload(allowUpload);

    const text = parameter.helpers.getText();
    handleInputError(text, inputType, inputMaxLength);
  }

  function handleInputError(
    input: string,
    inputType: string,
    inputMaxLength: number
  ) {
    // The ref is used to debounce the execution

    if (textInputErrorTimeoutRef.current)
      clearTimeout(textInputErrorTimeoutRef.current);

    textInputErrorTimeoutRef.current = setTimeout(() => {
      const error = getTextInputError(inputType, input.length, inputMaxLength);
      setTextInputError(error);
    }, 500);
  }

  function getTextInputError(
    inputType: string,
    inputLength: number,
    inputMaxLength: number
  ) {
    if (inputLength < inputMaxLength) return "";
    return `Task ${inputType} character limit: ${inputLength} / ${inputMaxLength}`;
  }

  const setTaskInputState = (
    input: UseRemirrorReturn<
      ReactExtensions<BoldExtension | PlaceholderExtension>
    >,
    text: string
  ) => {
    let newState;
    if (text === "") {
      newState = input.manager.createEmptyDoc();
    } else {
      newState = createProseMirrorDoc(text);
    }

    input.manager.view.updateState(
      input.manager.createState({
        content: newState,
      })
    );
  };

  // Upload task logic

  useEffect(() => {
    if (!task) return;
    setOriginalTask(task);
    setTaskInputState(taskTitle, task.title);
    setTaskInputState(taskDescription, task.description);
    setPriority(task.priority);
    setDuedate(task.duedate);
  }, [task, taskTitle, taskDescription]);

  const uploadTask = async function uploadTask() {
    if (!allowUpload || !originalTask) return;

    const taskTitleValue = getInputValue(taskTitle);
    const taskDescriptionValue = getInputValue(taskDescription);

    const newTask = Task(
      taskTitleValue,
      taskDescriptionValue,
      priority,
      duedate,
      originalTask.status,
      originalTask.timestamp,
      originalTask.id
    );

    const newTaskLocation =
      prevTaskLocation.projectID !== taskLocation.projectID ||
      prevTaskLocation.sectionID !== taskLocation.sectionID;

    if (isEqual(originalTask, newTask) && newTaskLocation === false) return;

    await editTask(
      originalTask,
      newTask,
      prevTaskLocation.projectID,
      prevTaskLocation.sectionID,
      taskLocation.projectID,
      taskLocation.sectionID
    );

    setOriginalTask(newTask);

    if (newTaskLocation) {
      dispatch(
        deleteTask({
          task: originalTask,
          projectID: prevTaskLocation.projectID,
          sectionID: prevTaskLocation.sectionID,
        })
      );
    }

    dispatch(
      setTask({
        task: newTask,
        projectID: taskLocation.projectID,
        sectionID: taskLocation.sectionID,
      })
    );
  };

  useEffect(() => {
    uploadTask();
  }, [taskLocation, priority, duedate]);

  let projectIcon;

  if (projectID === inboxID) {
    projectIcon = <InboxIcon />;
  } else {
    projectIcon = <div className="project-icon-circle"></div>;
  }

  return (
    <div className="task-modal" ref={taskModalRef} data-visible={isActive}>
      <header className="task-modal-header">
        <div className="task-modal-header-parents">
          <div className="task-modal-parent">
            {projectIcon}
            <span>{projectTitle}</span>
          </div>

          {sectionTitle && (
            <>
              <span className="task-modal-header-parent-separator">/</span>

              <span className="task-modal-parent">
                <SectionIcon />
                <span>{sectionTitle}</span>
              </span>
            </>
          )}
        </div>

        <div className="task-modal-header-buttons">
          <button
            className="task-header-button task-header-close"
            aria-label="Close task modal"
            onClick={() => {
              setIsActive(false);
            }}
          >
            <CloseIcon />
          </button>
        </div>
      </header>

      <div className="task-modal-container">
        <div className="task-in-modal-wrapper">
          <div className="task-in-modal" data-status={originalTask?.status}>
            <div className="task-in-modal-container">
              <button
                className="task-checkbox"
                data-priority={priority}
                ref={checkboxRef}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (handlingTaskStatusChange) return;

                  setHandlingTaskStatusChange(true);

                  const newTask = await handleTaskStatusChange();
                  if (newTask instanceof Error) return;

                  setHandlingTaskStatusChange(false);
                  setOriginalTask(newTask);
                }}
              >
                <CheckmarkIcon />
              </button>

              <div
                className="task-in-modal-taskbox"
                data-editable={showTaskbox}
              >
                <div
                  className="task-in-modal-taskbox-inputs"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== "P") return;
                    setShowTaskbox(true);
                    setPreviousTaskTitle(taskTitleValue);
                    setPreviousTaskDescription(taskDescriptionValue);
                  }}
                >
                  <Remirror
                    classNames={["task-in-modal-taskbox-title"]}
                    manager={taskTitle.manager}
                    initialContent={taskTitle.state}
                    onChange={(parameter) => {
                      handleTextInput(parameter, "title", 500);
                    }}
                  />
                  <Remirror
                    manager={taskDescription.manager}
                    initialContent={taskDescription.state}
                    onChange={(parameter) => {
                      handleTextInput(parameter, "description", 16368);
                    }}
                  />
                </div>

                <div className="task-box-text-inputs-error">
                  {textInputError}
                </div>
              </div>
            </div>

            {showTaskbox && (
              <div className="task-box-buttons">
                <button
                  type="button"
                  className="cta-cancel"
                  onClick={() => {
                    setShowTaskbox(false);
                    setTaskInputState(taskTitle, previousTaskTitle);
                    setTaskInputState(taskDescription, previousTaskDescription);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cta"
                  aria-disabled={!allowUpload}
                  onClick={() => {
                    uploadTask();
                    setShowTaskbox(false);
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <ul className="task-in-modal-parameters">
          <Dropdown
            Button={TaskModalDuedateButton}
            Dropdown={DuedateDropdown}
            value={duedate}
            setValue={setDuedate}
          />

          <Dropdown
            Button={TaskModalPriorityButton}
            Dropdown={PriorityDropdown}
            value={priority}
            setValue={setPriority}
          />

          <Dropdown
            Button={TaskModalSectionSelectDropdownButton}
            Dropdown={SectionSelectDropdown}
            DropdownProps={{
              projects,
              inboxID,
              taskLocation,
              setNewTaskLocation,
            }}
            ButtonProps={{
              taskLocation,
              currentFirstSectionLocationID:
                projects[taskLocation.projectID].firstSectionID,
              inboxID,
            }}
          />
        </ul>
      </div>
    </div>
  );
};
