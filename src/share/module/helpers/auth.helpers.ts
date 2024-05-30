import { compare, hash } from 'bcrypt';

const doHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const verify = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const AuthHelpers = {
  doHash,
  verify,
};
