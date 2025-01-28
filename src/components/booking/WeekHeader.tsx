import { getCurrentWeek } from "@/helper/date-time";
import moment from "moment";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

export function WeekHeader() {
  const weekDays = getCurrentWeek();
  const currentDay = moment().format("Do");

  return (
    <div className="weekday-header bg-teal-50 dark:bg-zinc-800 w-full h-12 flex ">
      <div className="placeholder w-36 border-2 flex justify-center items-center p-2">
        <RiArrowLeftSFill />
        Week
        <RiArrowRightSFill />
      </div>
      {weekDays.map((weekDay, index) => (
        <div
          key={index}
          className={`flex-1 border-2 flex flex-col p-1 text-sm ${
            currentDay === weekDay.Date ? "text-teal-400" : ""
          }`}
        >
          <span className="font-bold">
            {weekDay.Date}, {weekDay.Month}
          </span>
          <span>{weekDay.Day}</span>
        </div>
      ))}
    </div>
  );
}
