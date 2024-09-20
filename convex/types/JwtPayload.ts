export interface JwtPayload {
  data: {
    fbId: string;
    fbName: string;
    token: string;
  };
}
