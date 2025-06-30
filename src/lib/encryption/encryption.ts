import bcrypt from "bcrypt";

const generateSalt = () => bcrypt.genSalt(10);

export const hash = async (value: string) => {
  const salt = await generateSalt();
  return bcrypt.hash(value, salt);
};

export const compare = (cipher: string, hashedValue: string) => {
  return bcrypt.compare(cipher, hashedValue);
};
