import { program } from "commander";
import { createSuperAdmin } from "./commands/create-super-admin";

program
  .command("create-super-admin")
  .description("Create a super admin user")
  .action(createSuperAdmin);

program.parse(process.argv);
