import mongoose from "mongoose";
import Config from "../parameters/Config";
import DatabaseFactory from "./factory/DatabaseFactory";

// configuration variables
const config = Config.getInstance();

class MongoDatabase extends DatabaseFactory {
  async connectDatabase(): Promise<void> {
    const connectionURI = config.mongodbConnectionURI;

    this.database = await mongoose.connect(connectionURI, {
      dbName: config.databaseName,
      autoIndex: false,
    });

    // TODO: Log
  }

  async closeConnection(): Promise<void> {
    if (this.database) {
      await mongoose.connection.close();
      // TODO: Log
    }
  }
}

export default MongoDatabase;
