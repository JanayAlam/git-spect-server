import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { TRegisterRequestBody } from "../../dto/request-dto/auth.schema";
import BadRequestError from "../../errors/api-error-impl/BadRequestError";
import { createUser, getUserByEmail } from "../../services/user";

export const registerController = async (
  req: Request<unknown, unknown, TRegisterRequestBody, unknown>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(req.body);
  } catch (err) {
    next(err);
  }
};
