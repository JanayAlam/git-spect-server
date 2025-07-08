/*
  Warnings:

  - The values [GITHUB] on the enum `OAUTH_PROVIDER` will be removed. If these variants are still used in the database, this will fail.
  - The values [READ,WRITE,UPDATE,DELETE,MANAGE,CHANGE_PASSWORD,UPDATE_PROFILE] on the enum `PERMISSION_ACTION` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER,ROLE,USER_ROLES,PERMISSION,ROLE_PERMISSIONS] on the enum `PERMISSION_RESOURCE` will be removed. If these variants are still used in the database, this will fail.
  - The values [ALLOW,DENY,RESTRICT] on the enum `PERMISSION_TYPE` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,BANNED,PENDING] on the enum `USER_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ROOM_ROLE" AS ENUM ('owner');

-- AlterEnum
BEGIN;
CREATE TYPE "OAUTH_PROVIDER_new" AS ENUM ('github');
ALTER TABLE "oauth_accounts" ALTER COLUMN "provider" TYPE "OAUTH_PROVIDER_new" USING ("provider"::text::"OAUTH_PROVIDER_new");
ALTER TYPE "OAUTH_PROVIDER" RENAME TO "OAUTH_PROVIDER_old";
ALTER TYPE "OAUTH_PROVIDER_new" RENAME TO "OAUTH_PROVIDER";
DROP TYPE "OAUTH_PROVIDER_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PERMISSION_ACTION_new" AS ENUM ('read', 'write', 'update', 'delete', 'manage', 'change_password', 'update_profile');
ALTER TABLE "permissions" ALTER COLUMN "action" TYPE "PERMISSION_ACTION_new" USING ("action"::text::"PERMISSION_ACTION_new");
ALTER TYPE "PERMISSION_ACTION" RENAME TO "PERMISSION_ACTION_old";
ALTER TYPE "PERMISSION_ACTION_new" RENAME TO "PERMISSION_ACTION";
DROP TYPE "PERMISSION_ACTION_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PERMISSION_RESOURCE_new" AS ENUM ('user', 'role', 'user_roles', 'permission', 'role_permissions', 'room');
ALTER TABLE "permissions" ALTER COLUMN "resource" TYPE "PERMISSION_RESOURCE_new" USING ("resource"::text::"PERMISSION_RESOURCE_new");
ALTER TYPE "PERMISSION_RESOURCE" RENAME TO "PERMISSION_RESOURCE_old";
ALTER TYPE "PERMISSION_RESOURCE_new" RENAME TO "PERMISSION_RESOURCE";
DROP TYPE "PERMISSION_RESOURCE_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PERMISSION_TYPE_new" AS ENUM ('allow', 'deny', 'restrict');
ALTER TABLE "role_permissions" ALTER COLUMN "permission_type" DROP DEFAULT;
ALTER TABLE "role_permissions" ALTER COLUMN "permission_type" TYPE "PERMISSION_TYPE_new" USING ("permission_type"::text::"PERMISSION_TYPE_new");
ALTER TYPE "PERMISSION_TYPE" RENAME TO "PERMISSION_TYPE_old";
ALTER TYPE "PERMISSION_TYPE_new" RENAME TO "PERMISSION_TYPE";
DROP TYPE "PERMISSION_TYPE_old";
ALTER TABLE "role_permissions" ALTER COLUMN "permission_type" SET DEFAULT 'allow';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "USER_STATUS_new" AS ENUM ('active', 'banned', 'pending');
ALTER TABLE "users" ALTER COLUMN "user_status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "user_status" TYPE "USER_STATUS_new" USING ("user_status"::text::"USER_STATUS_new");
ALTER TYPE "USER_STATUS" RENAME TO "USER_STATUS_old";
ALTER TYPE "USER_STATUS_new" RENAME TO "USER_STATUS";
DROP TYPE "USER_STATUS_old";
ALTER TABLE "users" ALTER COLUMN "user_status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "role_permissions" ALTER COLUMN "permission_type" SET DEFAULT 'allow';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_status" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150),
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_users" (
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "ROOM_ROLE" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_users_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "id" VARCHAR(100) NOT NULL,
    "repository_fullname" VARCHAR(255) NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_repositories" (
    "roomId" TEXT NOT NULL,
    "repositoryId" VARCHAR(100) NOT NULL,

    CONSTRAINT "room_repositories_pkey" PRIMARY KEY ("roomId","repositoryId")
);

-- CreateTable
CREATE TABLE "commit_summaries" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "writer_username" VARCHAR(150) NOT NULL,
    "repository_id" TEXT NOT NULL,
    "repository_fullname" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commit_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commit_hashes" (
    "id" TEXT NOT NULL,
    "hash" VARCHAR(64) NOT NULL,
    "commit_summary_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commit_hashes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rooms_owner_id_idx" ON "rooms"("owner_id");

-- CreateIndex
CREATE INDEX "commit_summaries_repository_id_idx" ON "commit_summaries"("repository_id");

-- CreateIndex
CREATE INDEX "commit_summaries_room_id_idx" ON "commit_summaries"("room_id");

-- CreateIndex
CREATE INDEX "commit_hashes_hash_idx" ON "commit_hashes"("hash");

-- CreateIndex
CREATE INDEX "commit_hashes_commit_summary_id_idx" ON "commit_hashes"("commit_summary_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_users" ADD CONSTRAINT "room_users_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_users" ADD CONSTRAINT "room_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_repositories" ADD CONSTRAINT "room_repositories_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_repositories" ADD CONSTRAINT "room_repositories_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commit_summaries" ADD CONSTRAINT "commit_summaries_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commit_hashes" ADD CONSTRAINT "commit_hashes_commit_summary_id_fkey" FOREIGN KEY ("commit_summary_id") REFERENCES "commit_summaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
