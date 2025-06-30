import { NextFunction, Request, Response } from "express";
import {
  TLoginRequestBody,
  TRegisterRequestBody,
} from "../../dto/request-dto/auth.schema";
import BadRequestError from "../../errors/api-error-impl/BadRequestError";
import encryption from "../../lib/encryption";
import token from "../../lib/token";
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
      throw new BadRequestError(
        "Registration failed",
        req.headers["x-correlation-id"] as string,
        [
          {
            name: "email",
            message: "This email address is already registered",
            in: "body",
          },
        ],
      );
    }

    const hashedPassword = await encryption.hash(password);

    const newUser = await createUser({
      email,
      password: hashedPassword,
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
      throw new BadRequestError(
        "Login failed",
        req.headers["x-correlation-id"] as string,
        [
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
        ],
      );
    }

    const isPasswordValid = await encryption.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError(
        "Login failed",
        req.headers["x-correlation-id"] as string,
        [
          {
            name: "password",
            message: "Invalid email or password",
            in: "body",
          },
        ],
      );
    }

    const { password: _, ...loggedInUser } = user;

    const tokenPayload = {
      id: user.id,
      email: user.email,
      roleName: user.role.name,
    };

    const accessToken = token.signToken(tokenPayload, user.role.name, "access");

    const refreshToken = token.signToken(
      tokenPayload,
      user.role.name,
      "refresh",
    );

    res.json({ accessToken, refreshToken, user: loggedInUser });
  } catch (err) {
    next(err);
  }
};
