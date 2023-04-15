import { DateTime } from "luxon";

export const getFormattedDuedate = (duedateInput: string | undefined) => {
  if (!duedateInput) return "Due date";

  let formattedDuedate;
  let duedate = DateTime.fromISO(duedateInput);

  const year = duedate.year;
  const currentYear = DateTime.now().year;
  const today = DateTime.now().startOf("day");
  const tomorrow = today.plus({ days: 1 });

  if (+duedate > +today && +duedate <= +tomorrow) {
    formattedDuedate = "Today";
  }

  if (duedate.hour === 0 && duedate.minute === 0) {
    if (formattedDuedate !== "Today") {
      duedate = duedate.minus({ days: 1 });
      formattedDuedate = duedate.toFormat("MMM d");
    }
  } else {
    if (formattedDuedate === "Today") {
      formattedDuedate = formattedDuedate + duedate.toFormat(" t");
    } else {
      formattedDuedate = duedate.toFormat("MMM d t");
    }
  }

  if (year !== currentYear) formattedDuedate += "" + year;

  return formattedDuedate;
};
