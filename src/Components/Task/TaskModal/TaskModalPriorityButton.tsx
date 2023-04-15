import { ReactComponent as FlagIcon } from "../../../assets/flag.svg";

import { DropdownButtonProps } from "../../Dropdown";

export const TaskModalPriorityButton = ({
  isActive,
  setIsActive,
  value,
  refProp,
}: DropdownButtonProps) => {
  return (
    <button
      className="task-in-modal-parameter"
      type="button"
      data-priority={value}
      data-active={isActive}
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <div className="task-in-modal-parameter-icon">
        <FlagIcon />
      </div>
      <span className="task-in-modal-parameter-text">Priority {value}</span>
    </button>
  );
};
