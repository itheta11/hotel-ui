import { Rooms } from "@/constants/api-endpoints";
export interface Room {
  id: number;
  createdAt: string;
  floor: number;
  roomType: string;
  isAc: boolean;
  basePrice: number;
}

export function GetAllRooms(): Promise<Room[]> {
  return fetch(Rooms.GetAll).then((response) => response.json());
}
