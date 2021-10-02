import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';


const cryptoAsync = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await cryptoAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, appliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await cryptoAsync(appliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
