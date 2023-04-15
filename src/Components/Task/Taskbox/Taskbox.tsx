import { TaskI } from "../../../factories/task";
import { UserDataI } from "../../../factories/userData";

import { useEffect, useRef, useState } from "react";

import { NewTaskboxObserver } from "../../Project/Project";

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
import { editTask } from "../../../firebase/task/editTask";
import { deleteTask } from "../../../features/userDataSlice";

import { getActualTimestamp } from "../../../utils/getActualTimestamp";

interface TaskboxProps {
  projectID: string;
  sectionID: string;
  inboxID: string;
  task?: TaskI;
  showTaskbox: boolean;
  disableTaskbox: () => void;
  setEditTaskboxProcessIsRunning?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface TaskLocation {
  projectID: string;
  sectionID: string;
}

export const Taskbox = ({
  projectID,
  sectionID,
  inboxID,
  task,
  showTaskbox,
  disableTaskbox,
  setEditTaskboxProcessIsRunning,
}: TaskboxProps) => {
  const dispatch = useDispatch();

  const projects = useSelector(
    (state: RootState) => (state.userData as UserDataI).projects
  );

  // Taskbox inputs

  const [allowUpload, setAllowUpload] = useState(Boolean(task));
  const [textInputError, setTextInputError] = useState("");
  const [priority, setPriority] = useState(task?.priority || "4");
  const [duedate, setDuedate] = useState(task?.duedate || "");
  const [taskLocation, setTaskLocation] = useState<TaskLocation>({
    projectID,
    sectionID,
  });
  const [timestamp, setTimestamp] = useState(Date.now());

  const setNewTaskLocation = (newTaskLocation: TaskLocation) => {
    setTaskLocation(newTaskLocation);
  };

  // Subscribes the disable taskbox function so when a new taskbox is added to the page the current one is disabled and sets timestamp

  useEffect(() => {
    NewTaskboxObserver.subscribe(disableTaskbox);

    getActualTimestamp().then((timestamp: number) => {
      setTimestamp(timestamp);
    });

    return () => {
      NewTaskboxObserver.unsubscribe(disableTaskbox);
    };
  }, []);

  // Text inputs

  const taskTitle = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Task name` }),
    ],
    content: `<p>${task ? task.title : ""}</p>`,
    stringHandler: "html",
  });

  const taskTitleMaxLength = 500;

  const taskDescription = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new PlaceholderExtension({ placeholder: `Description` }),
    ],
    content: `<p>${task ? task.description : ""}</p>`,
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

  const textInputErrorTimeoutRef: React.MutableRefObject<null | NodeJS.Timeout> =
    useRef(null);

  function clearFields() {
    taskTitle.manager.view.updateState(
      taskTitle.manager.createState({
        content: taskTitle.manager.createEmptyDoc(),
      })
    );

    taskDescription.manager.view.updateState(
      taskDescription.manager.createState({
        content: taskDescription.manager.createEmptyDoc(),
      })
    );

    setDuedate("");
    setPriority("4");
    setTaskLocation({ projectID, sectionID });
  }

  async function uploadTask() {
    if (!allowUpload) return;

    const title = getInputValue(taskTitle);
    const description = getInputValue(taskDescription);

    /* If task is undefined, a new task is being created, otherwise a task is being edited */

    const newTask = !task
      ? Task(title, description, priority, duedate, "pending", timestamp)
      : Task(
          title,
          description,
          priority,
          duedate,
          task.status,
          task.timestamp,
          task.id
        );

    clearFields();
    if (task && setEditTaskboxProcessIsRunning) {
      setEditTaskboxProcessIsRunning(true);
      disableTaskbox();
    }

    if (
      task &&
      (projectID !== taskLocation.projectID ||
        sectionID !== taskLocation.sectionID)
    ) {
      dispatch(
        deleteTask({
          task,
          projectID,
          sectionID,
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

    if (!task) {
      await addTask(newTask, taskLocation.projectID, taskLocation.sectionID);
    } else if (setEditTaskboxProcessIsRunning) {
      await editTask(
        task,
        newTask,
        projectID,
        sectionID,
        taskLocation.projectID,
        taskLocation.sectionID
      );
      setEditTaskboxProcessIsRunning(false);
    }
  }

  return (
    <form className="task-box" data-visible={showTaskbox}>
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

        <button type="button" className="cta-cancel" onClick={disableTaskbox}>
          Cancel
        </button>
        <button
          type="button"
          className="cta"
          aria-disabled={!allowUpload}
          onClick={uploadTask}
        >
          {task ? "Save" : "Add task"}
        </button>
      </div>
    </form>
  );
};
