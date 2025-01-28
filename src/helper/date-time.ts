import moment from "moment";
interface WeekDetails {
  Date: string;
  Day: string;
  Month: string;
}
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
