import { Bookings, getAllBookings, getAllBookingsTest } from "@/api/bookings";
import { Room } from "@/api/rooms";
import {
  getDateY,
  getWeekStartandEndDate,
  WeekDetails,
} from "@/helper/date-time";
import { useQuery } from "@tanstack/react-query";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface RoomProps {
  roomIds: Number[];
  weekDays: Number[];
  bookings: Bookings;
}

const DAY_PARTS = 4;
const dayInterval = 24 / DAY_PARTS;

const Scheduler: React.FC<RoomProps> = ({ roomIds, weekDays, bookings }) => {
  const [fromDate, toDate] = getWeekStartandEndDate();
  const [layout, setLayout] = useState<GridLayout.Layout[]>([]);

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

  return (
    <div className={`booking-layout absolute top-12 left-36 bg-teal-400`}>
      <GridLayout
        className={`p-0 m-0`}
        layout={layout}
        cols={DAY_PARTS * 7}
        rowHeight={56}
        width={1308}
        margin={[4, 0]}
        onLayoutChange={(newLayout) => setLayout(newLayout)}
        preventCollision={true}
        compactType={null}
        draggableHandle=".handle"
        resizeHandles={["n", "e", "s", "w"]}
      >
        {layout.map(({ i, x, y, w, h }) => (
          <div
            className="handle bg-teal-300 bg-opacity-50 border-1 text-center"
            key={i}
          >
            <div className="text-sm">{`Item ${i}`}</div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Scheduler;
