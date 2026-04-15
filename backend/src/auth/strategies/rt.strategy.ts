import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback', // Tránh lỗi nếu .env chưa load
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // Sửa dòng này để hết lỗi đỏ
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token invalid');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
