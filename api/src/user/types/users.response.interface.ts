import { User } from '../user.schema';

export interface UsersResponseInterface {
  users: User[];
  count: number;
}
