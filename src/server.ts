import dotenv from "dotenv";
import http from "node:http";

import createApp from "./app-factory";
import Config from "./parameters/config";
import logger from "./utils/logger";

// loading all env variables
dotenv.config();

async function main() {
  // configuration variables
  const configInstance = Config.getInstance();

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
