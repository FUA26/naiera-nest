export interface IJwtPayload {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface IJwtToken {
  accessToken: string;
  refreshToken: string;
}
