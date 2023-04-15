import { ReactComponent as CalendarIcon } from "../../../assets/calendar.svg";

import { getFormattedDuedate } from "../utils/getFormatedDuedate";
import { getTaskPendingStatus } from "../utils/getTaskPendingStatus";

import { DropdownButtonProps } from "../../Dropdown";

export const DuedateButton = ({
  setIsActive,
  value,
  refProp,
}: DropdownButtonProps) => {
  const formattedDuedate = getFormattedDuedate(value);
  const pendingStatus = getTaskPendingStatus(value);

  return (
    <button
      className="task-box-button select-duedate"
      type="button"
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
      data-pending-status={pendingStatus}
    >
      <CalendarIcon />
      <span className="task-box-button-text">
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
