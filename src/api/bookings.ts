import { Booking } from "@/constants/api-endpoints";
import booking from "@/data/bookings.json";
export type Bookings = Booking[];

export interface Booking {
  id: string;
  createdAt: string;
  modifiedAt: any;
  checkIn: string;
  checkOut: string;
  totalBill: number;
  advanceAmount: number;
  user: User;
  rooms: Room[];
}

export interface User {
  id: string;
  name: string;
  address: string;
  phoneNumber: number;
  idProof: string;
}

export interface Room {
  id: number;
  createdAt: string;
  floor: number;
  roomType: string;
  isAc: boolean;
  basePrice: number;
}

export interface CreateBooking {
  userId: string;
  checkIn: string;
  checkOut: string;
  totalBill: number;
  advanceAmount: number;
  roomIds: number[];
}
export function getAllBookings(
  fromDate?: string,
  toDate?: string
): Promise<Bookings> {
  const url = new URL(Booking.GetAll);
  if (fromDate && toDate) {
    url.searchParams.append("fromDate", fromDate);
    url.searchParams.append("toDate", toDate);
  }
  return fetch(url).then((r) => r.json());
}

export function getAllBookingsTest(
  fromDate?: string,
  toDate?: string
): Promise<Bookings> {
  return new Promise((res, rej) => {
    setTimeout(() => res(booking), 3000);
  });
}

export function createBooking(booking: CreateBooking): Promise<Booking> {
  return fetch(Booking.CreateBooking, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  }).then((r) => r.json());
}

export function updateBooking(
  id: string,
  booking: CreateBooking
): Promise<any> {
  return fetch(Booking.UpdatBooking(id), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  }).then((r) => r);
}
