import {
  Booking,
  Bookings,
  getAllBookings,
  getAllBookingsTest,
} from "@/api/bookings";
import { Room } from "@/api/rooms";
import { Users } from "@/api/users";
import {
  getDateY,
  getWeekStartandEndDate,
  WeekDetails,
} from "@/helper/date-time";
import { useQuery } from "@tanstack/react-query";
import moment, { Moment } from "moment";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import AddBookingDialog from "./AddBookingDialog";
import { GripVertical, Pencil } from "lucide-react";
interface RoomProps {
  rooms: Room[];
  weekDays: Number[];
  bookings: Bookings;
  selectedBooking: (booking: Booking) => void;
}

const DAY_PARTS = 4;
const dayInterval = 24 / DAY_PARTS;

const Scheduler: React.FC<RoomProps> = ({
  rooms,
  weekDays,
  bookings,
  selectedBooking,
}) => {
  const [fromDate, toDate] = getWeekStartandEndDate();
  const [layout, setLayout] = useState<GridLayout.Layout[]>([]);
  const [selectedId, setSelectedId] = useState("");

  const roomIds = useMemo(() => {
    return rooms.map((data) => data.id);
  }, [rooms]);

  useEffect(() => {
    if (bookings) {
      const newLayout = bookings.map((booking) => {
        const roomIndexs = booking.rooms.map((room) => {
          return roomIds.indexOf(room.id);
        });
        const [firstIndex, lastIndex] = roomIndexs;
        let height = 1;
        if (lastIndex) {
          height = lastIndex - firstIndex + 1;
        }
        const checkInMoment = moment(booking.checkIn);
        const checkOutMoment = moment(booking.checkOut);

        const startY = getDateY(
          weekDays,
          checkInMoment,
          dayInterval,
          DAY_PARTS
        );
        const endY = getDateY(weekDays, checkOutMoment, dayInterval, DAY_PARTS);
        ///console.log({ checkInMoment, startY, checkOutMoment, endY });
        return {
          i: booking.id,
          x: startY,
          w: endY - startY + 1,
          y: firstIndex,
          h: height,
        };
      });
      setLayout([...newLayout]);
      console.log({ newLayout });
      console.log({ data: bookings });
    }
  }, [bookings]);

  const totalHeight = roomIds.length * 3.5;

  function handleBookingEdit(i: string): void {
    setSelectedId(i);
    const booking = bookings.find((b) => b.id === i);
    if (booking) {
      selectedBooking(booking);
    }
  }

  return (
    <div
      className={`booking-layout absolute top-12 left-[calc(9rem)] bg-teal-800`}
    >
      <GridLayout
        className={`p-0 m-0`}
        layout={layout}
        cols={DAY_PARTS * 7}
        rowHeight={56}
        width={1308}
        margin={[0, 0]}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        preventCollision={true}
        compactType={null}
        draggableHandle=".handle"
        draggableCancel=".cancel"
        resizeHandles={["n", "e", "s", "w"]}
      >
        {layout.map(({ i, x, y, w, h }) => (
          <div
            className="bg-teal-300 bg-opacity-50 border-2 border-teal-500 dark:border-teal-100"
            key={i}
          >
            <div className="text-sm">
              <GripVertical className="handle" />
              {`Item -${x}-${y}-${w}-${h} ${selectedId}`}
              <button className="cancel" onClick={() => handleBookingEdit(i)}>
                <Pencil />
              </button>
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Scheduler;
