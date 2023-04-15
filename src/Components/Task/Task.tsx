import { useRef, useState } from "react";

import { TaskI } from "../../factories/task";
import { getFormattedDuedate } from "./utils/getFormatedDuedate";
import { getTaskPendingStatus } from "./utils/getTaskPendingStatus";

import { ReactComponent as CheckmarkIcon } from "../../assets/check-mark.svg";
import { ReactComponent as CalendarIcon } from "../../assets/calendar.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../../assets/delete.svg";

import { Taskbox } from "./Taskbox/Taskbox";
import { DeleteModal } from "../DeleteModal";
import { CreateModal } from "../../utils/createModal";

import { useDispatch } from "react-redux";
import { deleteTask as deleteTaskReducerAction } from "../../features/userDataSlice";

import { deleteTask } from "../../firebase/task/deleteTask";
import { useHandleTaskStatusChange } from "./useHandleTaskStatusChange";

interface taskProps {
  task: TaskI;
  enableTaskbox: (
    taskboxType: "add" | "edit",
    taskboxSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  disableTaskbox: (
    taskboxSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  enableTaskModal: (task: TaskI) => void;
  disableTaskModal: () => void;
  projectID: string;
  sectionID: string;
  inboxID: string;
}

export const Task = ({
  task,
  enableTaskbox,
  disableTaskbox,
  enableTaskModal,
  projectID,
  sectionID,
  inboxID,
}: taskProps) => {
  const dispatch = useDispatch();

  const [showTask, setShowTask] = useState(true);

  const [showEditTaskbox, setShowEditTaskbox] = useState(false);
  const [editTaskboxProcessIsRunning, setEditTaskboxProcessIsRunning] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formattedDuedate = getFormattedDuedate(task.duedate as string);
  const pendingStatus = getTaskPendingStatus(task.duedate as string);

  const checkboxRef = useRef(null);
  const handleTaskStatusChange = useHandleTaskStatusChange(
    task,
    projectID,
    sectionID,
    checkboxRef,
    setShowTask
  );

  async function deleteTaskAction() {
    setShowTask(false);
    setShowDeleteModal(false);

    const taskWasDeleted = await deleteTask(task, projectID, sectionID);

    setTimeout(() => {
      if (taskWasDeleted) {
        dispatch(
          deleteTaskReducerAction({
            task,
            projectID,
            sectionID,
          })
        );
      }
    }, 200);
  }

  const deleteModal = CreateModal(
    DeleteModal,
    {
      elementType: "task",
      elementName: task.title,
      deleteAction: deleteTaskAction,
    },
    showDeleteModal,
    setShowDeleteModal,
    "overlay overlay-dark",
    200,
    true
  );

  function enableEditTaskbox() {
    enableTaskbox("edit", setShowEditTaskbox);
  }

  function disableEditTaskbox() {
    disableTaskbox(setShowEditTaskbox);
    setShowEditTaskbox(false);
  }

  return (
    <>
      {deleteModal}

      {!showEditTaskbox && (
        <div
          className="task"
          data-status={task.status}
          data-visible={showTask}
          aria-label="Task"
          onClick={() => {
            enableTaskModal(task);
          }}
        >
          <header>
            <button
              className="task-checkbox"
              data-priority={task.priority}
              aria-label={
                task.status === "pending"
                  ? "Mark task as completed"
                  : "Mark task as pending"
              }
              ref={checkboxRef}
              onClick={(e) => {
                e.stopPropagation();
                handleTaskStatusChange();
              }}
            >
              <CheckmarkIcon />
            </button>

            <h4>{task.title}</h4>
          </header>

          <div className="task-buttons">
            <button
              className="task-button"
              aria-label="Edit task"
              onClick={(e) => {
                e.stopPropagation();
                enableEditTaskbox();
              }}
            >
              <EditIcon />
            </button>
            <button
              className="task-button"
              aria-label="Delete task"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              <DeleteIcon />
            </button>
          </div>

          <p className="task-description" aria-label="Description">
            {task.description}
          </p>

          {task.duedate !== "" && (
            <div className="task-duedate" data-pending-status={pendingStatus}>
              <CalendarIcon />
              <span className="task-duedate-text">
                <span className="sr-only">Duedate: </span>
                {formattedDuedate}
              </span>
            </div>
          )}
        </div>
      )}

      {(showEditTaskbox || editTaskboxProcessIsRunning) && (
        <Taskbox
          showTaskbox={showEditTaskbox}
          disableTaskbox={disableEditTaskbox}
          projectID={projectID}
          sectionID={sectionID}
          inboxID={inboxID}
          task={task}
          setEditTaskboxProcessIsRunning={setEditTaskboxProcessIsRunning}
        />
      )}
    </>
  );
};
