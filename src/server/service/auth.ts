import jwt from 'jsonwebtoken';

export interface AuthService {
  createToken(payload: object): string;
  validate(token: string): boolean;
  decode(token: string): object;
}

export class JWTAuthService implements AuthService {
  constructor(private secret: string) {}

  createToken(payload: object) {
    return jwt.sign(payload, this.secret);
  }

  validate(token: string) {
    try {
      return jwt.verify(token, this.secret) ? true : false;
    } catch (e) {
      return false;
    }
  }

  decode(token: string) {
    return jwt.decode(token) as object;
  }
}
