import { Bookings } from "@/api/bookings";
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
import React, { useMemo } from "react";
import UserForm from "./create-booking/UserForm";
import { Users } from "@/api/users";
import { useNavigate } from "react-router";
import RoomBookForm from "./create-booking/RoomBookForm";

interface AddBookingProps {
  id?: string;
  rooms: Room[];
  bookings: Bookings;
  users: Users;
  onBookingDialogClose: () => void;
}

const MODE = {
  VIEW: "VIEW",
  CREATE: "CREATE",
  EDIT: "EDIT",
};

const AddBookingDialog: React.FC<AddBookingProps> = ({
  id,
  rooms,
  bookings,
  users,
  onBookingDialogClose,
}) => {
  const mode = id ? MODE.EDIT : MODE.CREATE;
  const navigate = useNavigate();

  function handleClose(open: boolean) {
    if (!open) {
      onBookingDialogClose();
    }
  }
  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="">
          <CopyPlus />
          Add booking
        </Button>
      </DialogTrigger>
      <DialogContent className="content max-w-3xl ">
        <DialogHeader>
          <DialogTitle>Booking </DialogTitle>
          <DialogDescription>
            {mode === MODE.CREATE && <span>Create a new Booking</span>}
            {mode === MODE.EDIT && <span>Edit the Booking</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[30rem] overflow-y-auto">
          <UserForm users={users} />
          <RoomBookForm rooms={rooms} bookings={bookings} />
        </div>
        <DialogFooter>
          <div className="w-full flex justify-end">
            <Button className="" type="submit">
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookingDialog;
