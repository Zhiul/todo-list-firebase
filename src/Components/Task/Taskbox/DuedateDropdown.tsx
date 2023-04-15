import Calendar from "react-calendar";
import { DropdownProps } from "../../Dropdown";

import { DateTime } from "luxon";

export const DuedateDropdown = ({
  isActive,
  value,
  setValue,
  refProp,
}: DropdownProps) => {
  const defaultDateValue = value
    ? DateTime.fromISO(value).minus({ days: 1 })
    : "";
  let defaultCalendarDate;

  if (defaultDateValue === "") {
    defaultCalendarDate = undefined;
  } else {
    defaultCalendarDate = defaultDateValue.toJSDate();
  }

  return (
    <div className="calendar-wrapper dropdown" ref={refProp}>
      <Calendar
        onChange={(dateValue: Date) => {
          let date = DateTime.fromJSDate(dateValue);
          date = date.plus({ days: 1 });
          setValue(date.toISO());
        }}
        defaultValue={defaultCalendarDate}
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
      />
    </div>
  );
};
