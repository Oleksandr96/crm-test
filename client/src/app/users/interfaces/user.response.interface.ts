import {User} from "./user.interface";

export interface UserResponse {
  users: User[],
  count: number;
}
