import { Role, User } from "@prisma/client";

type UserWithoutPassword = Omit<User, "password"> & { role: Role };

declare global {
  namespace Express {
    interface Request {
      user: UserWithoutPassword;
      correlationId: string;
    }
  }
}

export {};
