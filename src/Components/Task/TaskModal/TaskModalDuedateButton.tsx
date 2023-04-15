import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";

import { getFormattedDuedate } from "../utils/getFormatedDuedate";
import { getTaskPendingStatus } from "../utils/getTaskPendingStatus";

import { DropdownButtonProps } from "../../Dropdown";

export const TaskModalDuedateButton = ({
  isActive,
  setIsActive,
  value,
  refProp,
}: DropdownButtonProps) => {
  const formattedDuedate = getFormattedDuedate(value);
  const pendingStatus = getTaskPendingStatus(value);

  return (
    <button
      className="task-in-modal-parameter"
      type="button"
      onClick={() => {
        setIsActive(true);
      }}
      data-pending-status={pendingStatus}
      data-active={isActive}
      ref={refProp}
    >
      <div className="task-in-modal-parameter-icon">
        <CalendarIcon />
      </div>
      <span className="task-in-modal-parameter-text">
        {" "}
        <span className="sr-only">Duedate: </span>
        <span
          aria-label={formattedDuedate === "Due date" ? "Unset" : undefined}
        >
          {formattedDuedate}
        </span>
      </span>
    </button>
  );
};
