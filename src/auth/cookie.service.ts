import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static tokenKey = 'access-token';

  setToken(response: Response, token: string) {
    response.cookie(CookieService.tokenKey, token, {
      httpOnly: true,
      maxAge: 2592000000,
    });
  }

  removeToken(response: Response) {
    response.clearCookie(CookieService.tokenKey);
  }
}
