import moment, { Moment } from "moment";
export interface WeekDetails {
  Date: string;
  Day: string;
  Month: string;
}

const isoFormat = "YYYY-MM-DDTHH:mm:ss.SSS";

export function getCurrentWeek() {
  let weekDays: WeekDetails[] = [];
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf("isoWeek");
  for (let i = 0; i <= 6; i++) {
    const day = moment(weekStart).add(i, "days");
    weekDays.push({
      Date: day.format("Do"),
      Day: day.format("dddd"),
      Month: day.format("MMM"),
    });
  }
  return weekDays;
}

export function getIsoDateWithoutZone() {
  return moment().format(isoFormat);
}

export function getWeekStartandEndDate() {
  const weekStart = moment().clone().startOf("isoWeek");
  const weekEnd = moment(weekStart).add(6, "days");

  return [weekStart.format(isoFormat), weekEnd.format(isoFormat)];
}

export const getDateX = (
  weekDays: Number[],
  momentDate: Moment,
  dayInterval: number,
  dayParts: number
) => {
  const startDay = weekDays.indexOf(momentDate.date()) * dayParts;
  const getY = startDay + Math.floor(momentDate.hours() / dayInterval);
  return getY;
};
