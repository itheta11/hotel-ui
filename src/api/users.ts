import { User } from "@/constants/api-endpoints";

export type Users = User[];

export interface User {
  id: string;
  name: string;
  address: string;
  phoneNumber: number;
  idProof: string;
}

export interface CreateUser extends Omit<User, "id"> {}

export function getAllUsers(): Promise<Users> {
  return fetch(User.GetAll).then((r) => r.json());
}

export function addUser(user: CreateUser): Promise<User> {
  return fetch(User.CreateUser, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((r) => r.json());
}

export function updateUser(user: User): Promise<User> {
  return fetch(User.UpdateUser(user.id), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((r) => r.json());
}
