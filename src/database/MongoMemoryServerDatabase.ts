import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";
import DatabaseFactory from "./factory/DatabaseFactory";

class MongoMemoryServerDatabase extends DatabaseFactory {
  mongoMemoryServer = new MongoMemoryServer();

  async connectDatabase(): Promise<void> {
    this.database = await mongoose.connect(this.mongoMemoryServer.getUri(), {
      autoIndex: false,
    });

    // TODO: Log
  }

  async closeConnection(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    await this.mongoMemoryServer.stop();

    // TODO: Log
  }
}

export default MongoMemoryServerDatabase;
