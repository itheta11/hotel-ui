import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import moment from "moment";
import {
  getCurrentWeek,
  getWeekStartandEndDate,
  WeekDetails,
} from "@/helper/date-time";
import RoomLayout from "./RoomLayout";
import { useQuery } from "@tanstack/react-query";
import { GetAllRooms, Room } from "@/api/rooms";
import Scheduler from "./Scheduler";
import WeekHeader from "./WeekHeader";
import { useEffect, useState } from "react";

const weekDays = getCurrentWeek();
export default function Booking() {
  const [rooms, setRooms] = useState<Room[]>();
  const { data, isSuccess } = useQuery({
    queryKey: ["rooms"],
    queryFn: GetAllRooms,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      const rooms = data.sort((a, b) => a.id - b.id);
      setRooms([...rooms]);
    }
  }, [data]);

  return (
    <section className="w-full h-[calc(100vh-3.5rem)] p-2 overflow-x-hidden">
      <div className="h-full flex flex-col relative">
        {rooms?.length && (
          <>
            <WeekHeader
              weekDays={weekDays}
              roomIds={rooms.map((data) => data.id)}
            />
            <RoomLayout rooms={rooms} />
            <Scheduler
              roomIds={rooms.map((data) => data.id)}
              weekDays={weekDays.map((d) => parseInt(d.Date))}
            />
          </>
        )}
      </div>
    </section>
  );
}
