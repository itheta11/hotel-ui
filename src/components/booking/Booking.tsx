import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import moment from "moment";
import { getCurrentWeek } from "@/helper/date-time";
import { WeekHeader } from "./WeekHeader";
import RoomLayout from "./RoomLayout";
import { useQuery } from "@tanstack/react-query";
import { GetAllRooms } from "@/api/rooms";
import Scheduler from "./Scheduler";

export default function Booking() {
  const { data, isSuccess } = useQuery({
    queryKey: ["rooms"],
    queryFn: GetAllRooms,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    gcTime: Infinity,
  });
  return (
    <section className="w-full h-[calc(100vh-3.5rem)] p-2 overflow-x-hidden">
      <div className="h-full flex flex-col relative">
        <WeekHeader />
        {isSuccess && <RoomLayout rooms={data} />}
        {isSuccess && <Scheduler rooms={data} />}
      </div>
    </section>
  );
}
