import { Room } from "@/api/rooms";
import moment from "moment";
import { AirVent, BedDouble, BedSingle } from "lucide-react";

interface RoomProps {
  rooms: Room[];
}

const RoomLayout: React.FC<RoomProps> = ({ rooms }) => {
  const currDayOfWeek = moment().isoWeekday() - 1;
  return (
    <div className="roomlayout flex-1 ">
      {rooms?.map((room) => (
        <div
          className="roomRow w-full h-14 flex border-r-2 dark:border-r-zinc-400"
          key={room.id}
        >
          <div className="w-36 h-full p-1 bg-teal-50 dark:bg-zinc-800 text-sm flex items-center justify-between ">
            <span>Room {room.id}</span>
            <span className="flex gap-1">
              {room.isAc && <RoomIcon icon={<AirVent className="w-3 h-3" />} />}
              {room.roomType === "DOUBLE" ? (
                <RoomIcon icon={<BedDouble className="w-3 h-3" />} />
              ) : null}
              {room.roomType === "SINGLE" ? (
                <RoomIcon icon={<BedSingle className="w-3 h-3" />} />
              ) : null}
            </span>
          </div>
          {new Array(7).fill(0).map((_, index) => (
            <div
              key={index}
              className={`flex-1 border-2 dark:border-zinc-500 border-t-0 border-r-0 flex flex-col p-1 text-sm
                ${index === currDayOfWeek ? "dark:bg-zinc-600" : ""}
                `}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

const RoomIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <div className=" p-1 bg-teal-100 dark:bg-slate-700 rounded-sm flex items-center justify-center">
      {icon}
    </div>
  );
};

export default RoomLayout;
