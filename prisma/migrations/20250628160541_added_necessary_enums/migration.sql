/*
  Warnings:

  - The values [DISABLED] on the enum `USER_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PERMISSION_ACTION" ADD VALUE 'CHANGE_PASSWORD';
ALTER TYPE "PERMISSION_ACTION" ADD VALUE 'UPDATE_PROFILE';

-- AlterEnum
BEGIN;
CREATE TYPE "USER_STATUS_new" AS ENUM ('ACTIVE', 'BANNED', 'PENDING');
ALTER TABLE "users" ALTER COLUMN "user_status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "user_status" TYPE "USER_STATUS_new" USING ("user_status"::text::"USER_STATUS_new");
ALTER TYPE "USER_STATUS" RENAME TO "USER_STATUS_old";
ALTER TYPE "USER_STATUS_new" RENAME TO "USER_STATUS";
DROP TYPE "USER_STATUS_old";
ALTER TABLE "users" ALTER COLUMN "user_status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "name" SET DATA TYPE VARCHAR(40);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_status" SET DEFAULT 'PENDING';
