export interface jwtPayload {
  sub: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}
