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
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { CopyPlus } from "lucide-react";
import {
  Booking as BookingType,
  Bookings,
  getAllBookings,
} from "@/api/bookings";
import { getAllUsers } from "@/api/users";
import AddBookingDialog from "./AddBookingDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Spinner from "../ui/spinner";

const weekDays = getCurrentWeek();
export default function Booking() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Bookings>([]);
  const [fromDate, toDate] = getWeekStartandEndDate();
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingType>();
  const {
    data: roomsAndBooking,
    isSuccess: isRoomsAndBookingSuccess,
    refetch: refetchBookingRooms,
    isFetching: isBookingFetching,
  } = useQuery({
    queryKey: ["bookingRooms"],
    queryFn: () =>
      Promise.all([GetAllRooms(), getAllBookings(fromDate, toDate)]),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    gcTime: Infinity,
  });

  const {
    data: usersData,
    isSuccess: isUserSuccess,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", fromDate, toDate],
    queryFn: getAllUsers,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (roomsAndBooking) {
      const [getRooms, getBookings] = roomsAndBooking;
      const rooms = getRooms.sort((a, b) => a.id - b.id);
      setRooms([...rooms]);

      setBookings(getBookings);
    }
  }, [roomsAndBooking]);

  const allSuccess = useMemo(() => {
    return isRoomsAndBookingSuccess && isUserSuccess;
  }, [isRoomsAndBookingSuccess, isUserSuccess]);

  function handleSelectedBooking(booking: BookingType) {
    setSelectedBooking({ ...booking });
    setOpen(true);
  }

  function handleBookingDialogClose() {
    debugger;
    refetchBookingRooms();
    refetchUsers();
  }
  return (
    <section className="w-full h-[calc(100vh-3.5rem)] p-2 overflow-x-hidden">
      <Spinner isShow={isBookingFetching} />
      {rooms.length > 0 && (
        <>
          <div className=" w-full menubar p-1 flex justify-end">
            <div className="">
              {bookings.length > 0 && usersData && (
                <>
                  <Button
                    className=""
                    onClick={() => setOpen(true)}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    aria-controls="dialog-id"
                    data-state={open ? "open" : "closed"}
                  >
                    <CopyPlus />
                    Add booking
                  </Button>
                  <AddBookingDialog
                    open={open}
                    id={selectedBooking ? selectedBooking.id : ""}
                    selectedBooking={selectedBooking ?? undefined}
                    setOpen={setOpen}
                    rooms={rooms}
                    bookings={bookings}
                    users={usersData}
                    onBookingDialogClose={handleBookingDialogClose}
                  />
                </>
              )}
            </div>
          </div>
          <div className="h-full flex flex-col relative">
            <WeekHeader
              weekDays={weekDays}
              roomIds={rooms.map((data) => data.id)}
            />
            <RoomLayout rooms={rooms} />
            {bookings.length > 0 && usersData && (
              <Scheduler
                rooms={rooms}
                weekDays={weekDays.map((d) => parseInt(d.Date))}
                bookings={bookings}
                selectedBooking={handleSelectedBooking}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
}
