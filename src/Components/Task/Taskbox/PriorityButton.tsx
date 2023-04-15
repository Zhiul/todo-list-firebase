import { ReactComponent as FlagIcon } from "../../../assets/flag.svg";

import { DropdownButtonProps } from "../../Dropdown";

export const PriorityButton = ({
  setIsActive,
  value,
  refProp,
}: DropdownButtonProps) => {
  return (
    <button
      className="task-box-button select-priority"
      type="button"
      data-priority={value}
      onClick={() => {
        setIsActive(true);
      }}
      ref={refProp}
    >
      <FlagIcon />
      <span className="task-box-button-text">
        <span aria-label="Priority">P</span>
        {value}
      </span>
    </button>
  );
};
