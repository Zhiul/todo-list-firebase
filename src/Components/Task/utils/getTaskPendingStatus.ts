import { DateTime } from "luxon";

export const getTaskPendingStatus = (duedateInput: string) => {
  if (!duedateInput) return "pending";

  const duedate = DateTime.fromISO(duedateInput);

  const today = DateTime.now().startOf("day");
  const tomorrow = today.plus({ days: 1 });
  const now = DateTime.now();

  if (+duedate < +now) return "overdue";
  if (+duedate > +today && +duedate <= +tomorrow) return "today";
  return "pending";
};
