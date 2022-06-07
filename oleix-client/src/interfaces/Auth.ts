import { User } from './LoggedUserCookie';
import { Dispatch, SetStateAction } from 'react';

export interface Auth {
  auth: User | null;
  setAuth?: Dispatch<SetStateAction<User | null>> | null;
  logout?: () => void;
  cookieName?: string;
  getUser?: () => Promise<User | null>;
}
