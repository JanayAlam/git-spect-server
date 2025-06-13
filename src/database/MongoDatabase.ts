import mongoose from "mongoose";
import Logger from "../logger/Logger";
import Config from "../parameters/Config";
import DatabaseFactory from "./factory/DatabaseFactory";

// configuration variables
const configInstance = Config.getInstance();

// logger
const logger = Logger.getInstance().logger;

class MongoDatabase extends DatabaseFactory {
  async connectDatabase(): Promise<void> {
    const connectionURI = configInstance.mongodbConnectionURI;

    this.database = await mongoose.connect(connectionURI, {
      dbName: configInstance.databaseName,
      autoIndex: false,
    });

    logger.info("Database connection established");
  }

  async closeConnection(): Promise<void> {
    if (this.database) {
      await mongoose.connection.close();

      logger.info("Database connection closed");
    }
  }
}

export default MongoDatabase;
