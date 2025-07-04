import { PrismaClient, USER_STATUS } from "@prisma/client";
import bcrypt from "bcrypt";

const seedUsers = async (
  prisma: PrismaClient,
  email: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      userStatus: USER_STATUS.ACTIVE,
      role: {
        connect: { name: "super_admin" },
      },
    },
  });
};

export default seedUsers;
