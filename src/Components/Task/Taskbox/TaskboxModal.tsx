import { priorityValue } from "../../../factories/task";
import { UserDataI } from "../../../factories/userData";
import { TaskLocation } from "./Taskbox";

import { useEffect, useRef, useState } from "react";

import { useModalAnimation } from "../../../utils/useModalAnimation";

import { Dropdown } from "../../Dropdown";

import { PriorityButton } from "./PriorityButton";
import { PriorityDropdown } from "./PriorityDropdown";

import { DuedateButton } from "./DuedateButton";
import { DuedateDropdown } from "./DuedateDropdown";

import { SectionSelectDropdownButton } from "./SectionSelectDropdownButton";
import { SectionSelectDropdown } from "./SectionSelectDropdown";

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

import { Task } from "../../../factories/task";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { setTask } from "../../../features/userDataSlice";

import { addTask } from "../../../firebase/task/addTask";

import { getActualTimestamp } from "../../../utils/getActualTimestamp";

interface TaskboxModalProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  processIsRunning: boolean;
  setProcessIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  currentProjectID: string;
  inboxID: string;
}

export const TaskboxModal = ({
  isActive,
  setIsActive,
  processIsRunning,
  setProcessIsRunning,
  currentProjectID,
  inboxID,
}: TaskboxModalProps) => {
  const dispatch = useDispatch();

  const projects = useSelector(
    (state: RootState) => (state.userData as UserDataI).projects
  );

  const taskboxModalRef = useRef(null);
  useModalAnimation(taskboxModalRef, isActive, true);

  // Taskbox inputs

  const [allowUpload, setAllowUpload] = useState(false);
  const [textInputError, setTextInputError] = useState("");
  const [priority, setPriority] = useState<priorityValue>("4");
  const [duedate, setDuedate] = useState("");
  const [taskLocation, setTaskLocation] = useState<TaskLocation>({
    projectID: currentProjectID,
    sectionID: projects[currentProjectID].firstSectionID,
  });
  const [timestamp, setTimestamp] = useState(Date.now());

  const setNewTaskLocation = (newTaskLocation: TaskLocation) => {
    setTaskLocation(newTaskLocation);
  };

  useEffect(() => {
    getActualTimestamp().then((timestamp: number) => {
      setTimestamp(timestamp);
    });
  }, []);

  // Text inputs code

  const taskTitle = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Task name` }),
    ],
    content: `<p></p>`,
    stringHandler: "html",
  });

  const taskTitleMaxLength = 500;

  const taskDescription = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Description` }),
    ],
    content: `<p></p>`,
    stringHandler: "html",
  });

  const taskDescriptionMaxLength = 16368;

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
    const taskTitleValue = taskTitle.getContext()
      ? (
          taskTitle.getContext() as ReactFrameworkOutput<
            ReactExtensions<BoldExtension | PlaceholderExtension>
          >
        ).helpers.getText()
      : "";

    const taskDescriptionValue = taskDescription.getContext()
      ? (
          taskDescription.getContext() as ReactFrameworkOutput<
            ReactExtensions<BoldExtension | PlaceholderExtension>
          >
        ).helpers.getText()
      : "";

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

  const textInputErrorTimeoutRef: React.MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);

  async function uploadTask() {
    if (!allowUpload) return;

    const title = getInputValue(taskTitle);
    const description = getInputValue(taskDescription);

    setIsActive(false);
    setProcessIsRunning(true);

    /* If task is undefined, a new task is being created, otherwise a task is being edited */

    const newTask = Task(
      title,
      description,
      priority,
      duedate,
      "pending",
      timestamp
    );

    dispatch(
      setTask({
        task: newTask,
        projectID: taskLocation.projectID,
        sectionID: taskLocation.sectionID,
      })
    );

    await addTask(newTask, taskLocation.projectID, taskLocation.sectionID);

    setProcessIsRunning(false);
  }

  return (
    <form
      className="task-box task-box-modal modal"
      data-visible={isActive}
      ref={taskboxModalRef}
    >
      <div className="task-box-text-inputs">
        <Remirror
          manager={taskTitle.manager}
          initialContent={taskTitle.state}
          onChange={(parameter) => {
            handleTextInput(parameter, "title", 500);
          }}
          classNames={["taskbox-title-input"]}
        />
        <Remirror
          manager={taskDescription.manager}
          initialContent={taskDescription.state}
          onChange={(parameter) => {
            handleTextInput(parameter, "description", 16368);
          }}
          classNames={["taskbox-description-input"]}
        />
      </div>

      <div className="task-box-text-inputs-error">{textInputError}</div>

      <div className="task-box-task-parameters">
        <Dropdown
          Button={DuedateButton}
          Dropdown={DuedateDropdown}
          DropdownProps={{}}
          value={duedate}
          setValue={setDuedate}
        />
        <Dropdown
          Button={PriorityButton}
          Dropdown={PriorityDropdown}
          DropdownProps={{}}
          value={priority}
          setValue={setPriority}
        />
      </div>

      <div className="task-box-separator"></div>

      <div className="task-box-buttons">
        <div className="section-select-wrapper">
          <Dropdown
            Button={SectionSelectDropdownButton}
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
        </div>

        <button
          type="button"
          className="cta-cancel"
          onClick={() => {
            setIsActive(false);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="cta"
          aria-disabled={!allowUpload}
          onClick={uploadTask}
        >
          Add task
        </button>
      </div>
    </form>
  );
};
