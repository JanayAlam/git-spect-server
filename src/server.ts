import dotenv from "dotenv";
import http from "node:http";

import App from "./app/App";
import Logger from "./logger/Logger";
import Config from "./parameters/Config";

// loading all env variables
dotenv.config();

// express application
const app = new App();

// configuration variables
const configInstance = Config.getInstance();

// logger
const logger = Logger.getInstance().logger;

async function main() {
  try {
    await app.connectDB();

    const server = http.createServer(app.getApp());
    server.listen(configInstance.port);
    logger.info(`Server running on port ${configInstance.port}`);
  } catch (err) {
    logger.error((err as Error)?.message);
    process.exit(1);
  }
}

main();
