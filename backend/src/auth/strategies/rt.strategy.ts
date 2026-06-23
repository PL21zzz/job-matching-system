import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          const cookie = request.headers.cookie
            ?.split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith('refresh_token='));
          return cookie
            ? decodeURIComponent(cookie.substring('refresh_token='.length))
            : null;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback', // Tránh lỗi nếu .env chưa load
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // Sửa dòng này để hết lỗi đỏ
    const refreshToken =
      req.get('Authorization')?.replace('Bearer', '').trim() ||
      req.headers.cookie
        ?.split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith('refresh_token='))
        ?.substring('refresh_token='.length);

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token invalid');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
