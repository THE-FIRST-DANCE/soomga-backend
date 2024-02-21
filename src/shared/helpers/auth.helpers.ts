import { randomBytes, scrypt } from 'crypto';

const hash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(8).toString('hex');

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};

const verify = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString('hex'));
    });
  });
};

const generateRandomPassword = (): string => {
  const randomPassword = randomBytes(8).toString('hex');
  return randomPassword;
};

// 6자리 인증코드 생성 (숫자 + 대문자)
const generateAuthCode = (): string => {
  const authCode = randomBytes(3).toString('hex').toUpperCase();
  return authCode;
};

export const AuthHelpers = {
  hash,
  verify,
  generateRandomPassword,
  generateAuthCode,
};
