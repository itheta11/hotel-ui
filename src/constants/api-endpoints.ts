import { API_URL } from ".";

export const RoomsController = API_URL + "/Rooms";
export const Rooms = {
  GetAll: `${RoomsController}`,
};

export const BookingController = API_URL + "/Booking";
export const Booking = {
  GetAll: `${BookingController}`,
  CreateBooking: `${BookingController}`,
  UpdatBooking: (id: string) => `${BookingController}/${id}`,
};

export const UsersController = API_URL + "/Users";
export const User = {
  GetAll: `${UsersController}`,
  CreateUser: `${UsersController}`,
  UpdateUser: (id: string) => `${UsersController}/${id}`,
};
