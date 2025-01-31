import { Bookings } from "@/api/bookings";
import { Room } from "@/api/rooms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoomBookProps {
  rooms: Room[];
  bookings: Bookings;
}

const RoomBookForm: React.FC<RoomBookProps> = ({ rooms, bookings }) => {
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Room</CardTitle>
        <CardContent></CardContent>
      </CardHeader>
    </Card>
  );
};

export default RoomBookForm;
