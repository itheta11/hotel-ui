import { API_URL } from ".";

export const RoomsController = API_URL + "/Rooms";
export const Rooms = {
  GetAll: `${RoomsController}`,
};

export const BookingController = API_URL + "/Booking";
export const Booking = {
  GetAll: `${BookingController}`,
};
