import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";
import Logger from "../logger";
import DatabaseFactory from "./factory/DatabaseFactory";

// logger
const logger = Logger.getInstance().logger;

class MongoMemoryServerDatabase extends DatabaseFactory {
  mongoMemoryServer: MongoMemoryServer | null = null;

  async connectDatabase(): Promise<void> {
    this.mongoMemoryServer = await MongoMemoryServer.create();

    this.database = await mongoose.connect(this.mongoMemoryServer.getUri(), {
      autoIndex: false,
    });

    logger.info("Test database connection established");
  }

  async closeConnection(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    if (this.mongoMemoryServer) {
      await this.mongoMemoryServer.stop();
    }

    logger.info("Database connection closed");
  }
}

export default MongoMemoryServerDatabase;
