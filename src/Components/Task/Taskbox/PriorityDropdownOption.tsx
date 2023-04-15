import { ReactComponent as FlagIcon } from "../../../assets/flag.svg";
import { ReactComponent as CheckmarkIcon } from "../../../assets/check-mark.svg";

type priorityValue = "1" | "2" | "3" | "4";

export const PriorityDropdownOption = ({
  currentValue,
  value,
  setValue,
  setIsActive,
}: {
  currentValue: priorityValue;
  value: priorityValue;
  setValue: React.Dispatch<priorityValue>;
  setIsActive: React.Dispatch<boolean>;
}) => {
  return (
    <div
      className="priority-select-dropdown-option"
      role="option"
      data-priority={value}
      onClick={() => {
        setValue(value);
        setIsActive(false);
      }}
      aria-selected={currentValue === value}
    >
      <FlagIcon />
      <span className="priority-select-dropdown-option-text">
        Priority {value}
      </span>
      <CheckmarkIcon className="priority-checkmark" />
    </div>
  );
};
