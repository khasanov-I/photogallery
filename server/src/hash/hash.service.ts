import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { syncScrypt } from 'scrypt-js';

@Injectable()
export class HashService {
  async hashPassword(password: string, salt?: string) {
    const saltBuf = salt ? Buffer.from(salt, 'hex') : crypto.randomBytes(16);

    const N = 16384,
      r = 8,
      p = 1,
      dkLen = 64;

    const derivedKey = syncScrypt(
      Buffer.from(password, 'utf8'),
      saltBuf,
      N,
      r,
      p,
      dkLen,
    );

    return {
      salt: saltBuf.toString('hex'),
      hash: Buffer.from(derivedKey).toString('hex'),
    };
  }

  async verifyPassword(password: string, hash: string, salt: string) {
    const { hash: derivedHash } = await this.hashPassword(password, salt);
    return derivedHash === hash;
  }
}
