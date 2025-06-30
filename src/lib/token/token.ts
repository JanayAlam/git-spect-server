import jwt, { SignOptions } from "jsonwebtoken";
import { SYSTEM_ROLE, TSystemRole } from "../../database/enums/system-role";
import Config from "../../parameters/config";

const configInstance = Config.getInstance();

type TokenSubject = TSystemRole | string;
type TokenKind = "access" | "refresh";

function getSecretAndExpire(subject: TokenSubject, kind: TokenKind) {
  if (subject === SYSTEM_ROLE.SUPER_ADMIN) {
    return {
      secret: configInstance.jwtSecretSuperAdmin,
      expiresIn:
        kind === "access"
          ? configInstance.jwtAccessTokenExpire
          : configInstance.jwtRefreshTokenExpire,
    };
  } else {
    return {
      secret: configInstance.jwtSecretUser,
      expiresIn:
        kind === "access"
          ? configInstance.jwtAccessTokenExpire
          : configInstance.jwtRefreshTokenExpire,
    };
  }
}

export function signToken<T>(
  payload: T,
  subject: TokenSubject,
  kind: TokenKind,
) {
  const { secret, expiresIn } = getSecretAndExpire(subject, kind);

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ data: payload }, secret, options);
}

export function verifyToken(
  token: string,
  subject: TokenSubject,
  kind: TokenKind,
) {
  const { secret } = getSecretAndExpire(subject, kind);
  return jwt.verify(token, secret);
}
