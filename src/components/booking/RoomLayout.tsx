import { Room } from "@/api/rooms";

interface RoomProps {
  rooms: Room[];
}

const RoomLayout: React.FC<RoomProps> = ({ rooms }) => {
  return (
    <div className="roomlayout flex-1 ">
      {rooms?.map((room) => (
        <div className="roomRow w-full h-14 border-2" key={room.id}>
          <div className="w-36 h-full bg-teal-50 dark:bg-zinc-800 flex items-center justify-center ">
            Room {room.id}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomLayout;
