import { Room } from "@/api/rooms";
import moment from "moment";
import { AirVent } from "lucide-react";

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
          <div className="w-36 h-full bg-teal-50 dark:bg-zinc-800 text-sm flex items-center ">
            Room {room.id}
            {room.isAc && <AirVent />}
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

export default RoomLayout;
