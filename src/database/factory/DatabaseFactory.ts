import { Mongoose } from "mongoose";

abstract class DatabaseFactory {
  database: Mongoose | null = null;

  abstract connectDatabase(): Promise<void>;
  abstract closeConnection(): Promise<void>;
}

export default DatabaseFactory;
