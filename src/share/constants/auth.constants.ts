//eslint-disable-next-line
require('dotenv').config();

export const MAX_AGE = process.env.AUTH_COOKIES_MAX_AGE;

export enum Role {
  User = 'user',
  Admin = 'admin',
}
