import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

const cookieExtractor = (request: any): string | null => {
  const cookieHeader = request?.headers?.cookie;
  if (!cookieHeader) return null;
  const tokenCookie = cookieHeader
    .split(';')
    .map((item: string) => item.trim())
    .find((item: string) => item.startsWith('access_token='));
  return tokenCookie
    ? decodeURIComponent(tokenCookie.substring('access_token='.length))
    : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
