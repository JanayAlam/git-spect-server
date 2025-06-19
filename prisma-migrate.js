const { execSync } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");

const name = process.argv[2];

if (!name) {
  execSync(`echo "Migration name is required"`, { stdio: "inherit" });
  process.exit(1);
}

dotenv.config({
  path: path.resolve(__dirname, `.env.development`),
});

try {
  execSync(`npx prisma migrate dev --name ${name}`, { stdio: "inherit" });
} catch (err) {
  execSync(`echo "Migration failed: ${err}"`);
  process.exit(1);
}
