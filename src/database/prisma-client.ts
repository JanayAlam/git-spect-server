import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: [
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
    { level: "error", emit: "event" },
  ],
});

prisma.$on("warn", (e: any) => {
  logger.warn("Prisma Warning:", e);
});

prisma.$on("info", (e: any) => {
  logger.info("Prisma Info:", e);
});

prisma.$on("error", (e: any) => {
  logger.error("Prisma Error:", e);
});

export default prisma;
