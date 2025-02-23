import { getCurrentWeek, WeekDetails } from "@/helper/date-time";
import moment from "moment";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Calendar } from "../ui/calendar";

interface WeekHeaderProps {
  roomIds: Number[];
  weekDays: WeekDetails[];
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ roomIds, weekDays }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const currentDay = moment().format("Do");

  return (
    <div className="weekday-header bg-teal-50 dark:bg-zinc-800 w-full h-12 flex border-r-2 dark:border-r-zinc-400">
      <div className="placeholder w-36 border-2 flex justify-center items-center p-2 ">
        <RiArrowLeftSFill />
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"sm"} variant={"secondary"} className="">
              Week
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
          </PopoverContent>
        </Popover>
        <RiArrowRightSFill />
      </div>
      {weekDays.map((weekDay, index) => (
        <div
          key={index}
          className={`flex-1 border-2 dark:border-zinc-400 border-r-0 flex flex-col p-1 text-sm 
            ${currentDay === weekDay.Date ? "text-teal-400 relative" : ""}`}
        >
          {currentDay === weekDay.Date && (
            <CurrentTimePointer roomIds={roomIds} />
          )}
          <span className="font-bold">
            {weekDay.Date}, {weekDay.Month}
          </span>
          <span>{weekDay.Day}</span>
        </div>
      ))}
    </div>
  );
};

const CurrentTimePointer: React.FC<{ roomIds: Number[] }> = ({ roomIds }) => {
  const currentTimestamp = `${moment().format("HH:mm ")}`;
  const currentHr = moment().hours();

  return (
    <div
      className="absolute z-50 top-12 -left-1 w-0.5 bg-red-500"
      style={{
        height: roomIds.length * 3.5 + "rem",
        marginLeft: currentHr * 0.5125 + "rem",
      }}
    >
      <div className="relative">
        <div className="absolute p-1 bg-red-500 text-white">
          {currentTimestamp}
        </div>
      </div>
    </div>
  );
};

export default WeekHeader;
