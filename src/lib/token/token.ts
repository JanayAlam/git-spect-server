import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import Config from "../../parameters/config";

const configInstance = Config.getInstance();

type TokenKind = "access" | "refresh";

export interface IBaseJwtPayload extends JwtPayload {
  sub: string; // subject (user id or similar)
  roleId?: string; // role id
  [key: string]: any;
}

export const signToken = (
  payload: IBaseJwtPayload,
  kind: TokenKind,
  customOptions?: SignOptions,
) => {
  if (!payload || !payload.sub) {
    throw new Error('JWT payload must include a "sub" (subject) property');
  }

  const expiresIn =
    kind === "access"
      ? configInstance.jwtAccessTokenExpire
      : configInstance.jwtRefreshTokenExpire;

  const options: SignOptions = {
    expiresIn: expiresIn as any,
    ...customOptions,
  };

  return jwt.sign(payload, configInstance.jwtSecret, options);
};

export const verifyToken = (token: string) => {
  const payload = jwt.verify(
    token,
    configInstance.jwtSecret,
  ) as IBaseJwtPayload;

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return null;
  }

  return payload;
};
