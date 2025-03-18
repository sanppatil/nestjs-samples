/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: configService.get<string>('AZURE_AD_JWKS_URI') || '',
        cache: true,
        rateLimit: true,
      }),
    });

    // Ensure jwksUri is correctly set, otherwise throw an error
    const jwksUri = configService.get<string>('AZURE_AD_JWKS_URI');
    if (!jwksUri) {
      throw new Error('AZURE_AD_JWKS_URI is not set in .env file');
    }
  }

  async validate(payload: any) {
    if (!payload || !payload.roles) {
      throw new UnauthorizedException('Invalid token');
    }
    return { userId: payload.sub, roles: payload.roles };
  }
}
