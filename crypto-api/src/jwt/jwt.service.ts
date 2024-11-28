import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';

//const secret = 'your-very-secure-secret'; // Replace with a strong secret

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  getSecret(): string {
    return this.configService.get<string>('SECRET');
  }

  generateHash(data: string): string {
    const guid = uuidv4();
    console.log('Generated GUID:', guid);
    const hash = crypto.createHash('sha256');
    hash.update(data + guid);
    const hashed = hash.digest('hex');
    console.log('Hash: ' + hashed);
    return hashed;
  }

  generateJWT(data: string): string {
    // Define the payload
    const payload = {
      transactionid: this.generateHash(data),
    };

    // Define options for the token
    const options = {
      expiresIn: '1h', // Token expiration: 1 hour
      issuer: 'enodation.org', // Optional: Issuer of the token
    };

    // Generate the token using the secret key
    const token = jwt.sign(payload, this.getSecret(), options);

    console.log(`Generated Token: ${token}`);
    console.log(
      `Use this token in a URL query param: ?token=${encodeURIComponent(token)}`,
    );

    return token;
  }
}
