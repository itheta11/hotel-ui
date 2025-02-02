import { Booking, Bookings } from "@/api/bookings";
import { Room } from "@/api/rooms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyPlus } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import UserForm, { UserFormRef } from "./create-booking/UserForm";
import { Users } from "@/api/users";
import { useNavigate } from "react-router";
import RoomBookForm from "./create-booking/RoomBookForm";

interface AddBookingProps {
  id?: string;
  selectedBooking?: Booking;
  rooms: Room[];
  bookings: Bookings;
  users: Users;
  onBookingDialogClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MODE = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

const AddBookingDialog: React.FC<AddBookingProps> = ({
  id,
  selectedBooking,
  rooms,
  bookings,
  users,
  open,
  setOpen,
  onBookingDialogClose,
}) => {
  const mode = id ? MODE.EDIT : MODE.CREATE;
  const navigate = useNavigate();
  const userRef = useRef<UserFormRef>(null);

  function handleClose(open: boolean) {
    if (!open) {
      onBookingDialogClose();
    }
    setOpen(open);
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="content max-w-3xl ">
        <DialogHeader>
          <DialogTitle>Booking </DialogTitle>
          <DialogDescription>
            {mode === MODE.CREATE && <span>Create a new Booking</span>}
            {mode === MODE.EDIT && <span>Edit the Booking</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[30rem] overflow-y-auto">
          <UserForm
            users={users}
            ref={userRef}
            selectedUser={selectedBooking ? selectedBooking.user : undefined}
          />
          <RoomBookForm
            mode={mode}
            bookingId={id}
            selectedBooking={selectedBooking}
            rooms={rooms}
            bookings={bookings}
            getUserId={() => userRef.current?.getUserId()}
            onClose={() => handleClose(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
