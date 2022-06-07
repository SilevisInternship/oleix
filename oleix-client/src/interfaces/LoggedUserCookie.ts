export interface User {
  userId: string;
  username: string;
  localization: string;
  email: string;
  phone: string;
}

export interface LoggedUserCookie {
  token?: string;
  user?: User;
}
