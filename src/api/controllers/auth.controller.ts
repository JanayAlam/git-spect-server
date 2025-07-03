import { NextFunction, Request, Response } from "express";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import {
  TLoginRequestBody,
  TRegisterRequestBody,
} from "../../dto/request-dto/auth.schema";
import BadRequestError from "../../errors/api-error-impl/BadRequestError";
import encryption from "../../lib/encryption";
import tokenService from "../../lib/token";
import { IBaseJwtPayload } from "../../lib/token/token";
import { createUser, getUserByEmail } from "../../services/user/user.service";

export const registerController = async (
  req: Request<unknown, unknown, TRegisterRequestBody, unknown>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email, {
      omit: { password: true },
    });

    if (existingUser) {
      throw new BadRequestError("Registration failed", [
        {
          name: "email",
          message: "This email address is already registered",
          in: "body",
        },
      ]);
    }

    const hashedPassword = await encryption.hash(password);

    const newUser = await createUser({
      email,
      password: hashedPassword,
      role: {
        connect: { name: SYSTEM_ROLE.USER },
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request<unknown, unknown, TLoginRequestBody, unknown>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      throw new BadRequestError("Login failed", [
        {
          name: "email",
          message: "Invalid email or password",
          in: "body",
        },
        {
          name: "password",
          message: "Invalid email or password",
          in: "body",
        },
      ]);
    }

    const isPasswordValid = await encryption.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Login failed", [
        {
          name: "password",
          message: "Invalid email or password",
          in: "body",
        },
      ]);
    }

    const { password: _, ...loggedInUser } = user;

    const tokenPayload: IBaseJwtPayload = {
      sub: user.id,
      roleId: user.role.id,
    };

    const accessToken = tokenService.signToken(tokenPayload, "access");
    const refreshToken = tokenService.signToken(tokenPayload, "refresh");

    res.json({ accessToken, refreshToken, user: loggedInUser });
  } catch (err) {
    next(err);
  }
};
