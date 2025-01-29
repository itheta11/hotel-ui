import { getCurrentWeek } from "@/helper/date-time";
import moment from "moment";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

export function WeekHeader() {
  const weekDays = getCurrentWeek();
  const currentDay = moment().format("Do");

  return (
    <div className="weekday-header bg-teal-50 dark:bg-zinc-800 w-full h-12 flex border-r-2 dark:border-r-zinc-400">
      <div className="placeholder w-36 border-2 flex justify-center items-center p-2 ">
        <RiArrowLeftSFill />
        Week
        <RiArrowRightSFill />
      </div>
      {weekDays.map((weekDay, index) => (
        <div
          key={index}
          className={`flex-1 border-2 dark:border-zinc-400 border-r-0 flex flex-col p-1 text-sm 
            ${currentDay === weekDay.Date ? "text-teal-400 relative" : ""}`}
        >
          {currentDay === weekDay.Date && <CurrentTimePointer />}
          <span className="font-bold">
            {weekDay.Date}, {weekDay.Month}
          </span>
          <span>{weekDay.Day}</span>
        </div>
      ))}
    </div>
  );
}

const CurrentTimePointer = () => {
  const currentTimestamp = `${moment().format("HH:mm ")}`;
  const currentHr = moment().hours();

  return (
    <div
      className="absolute z-50 top-12 -left-1 w-0.5 h-screen bg-red-500"
      style={{ marginLeft: currentHr * 0.5125 + "rem" }}
    >
      <div className="relative">
        <div className="absolute p-1 bg-red-500 text-white">
          {currentTimestamp}
        </div>
      </div>
    </div>
  );
};
