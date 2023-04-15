import { priorityValue } from "../../../factories/task";

import { DropdownProps } from "../../Dropdown";

import { PriorityDropdownOption } from "./PriorityDropdownOption";

const priorityValues: priorityValue[] = ["1", "2", "3", "4"];

export const PriorityDropdown = ({
  isActive,
  setIsActive,
  value,
  setValue,
  refProp,
}: DropdownProps) => {
  return (
    <div className="dropdown" role="listbox" ref={refProp}>
      <ul className="priority-select" role="listbox">
        {priorityValues.map((priorityValue) => {
          return (
            <li key={priorityValue}>
              <PriorityDropdownOption
                currentValue={value}
                value={priorityValue}
                setValue={setValue}
                setIsActive={setIsActive}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
