import dotenv from "dotenv";
import http from "node:http";

import App from "./app/App";
import Config from "./parameters/Config";

// loading all env variables
dotenv.config();

// express application
const app = new App();

// configuration variables
const config = Config.getInstance();

async function main() {
  try {
    const server = http.createServer(app.getApp());

    server.listen(config.port);
  } catch (_err) {
    process.exit(1);
  }
}

main();
