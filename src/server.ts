import dotenv from "dotenv";
import http from "node:http";
import path from "node:path";

import createApp from "./app-factory";
import Config from "./parameters/config";
import logger from "./utils/logger";

async function main() {
  // configuration variables
  const configInstance = Config.getInstance();

  // loading all env variables
  dotenv.config({
    path: path.resolve(__dirname, `.env.${configInstance.environment}`),
  });

  // express application
  const app = createApp();

  try {
    const server = http.createServer(app);
    server.listen(configInstance.port);
    logger.info(
      `${configInstance.appName} running on port ${configInstance.port}`,
    );
  } catch (err) {
    logger.error("Error trying to run the application:", err);
    process.exit(1);
  }
}

main();
