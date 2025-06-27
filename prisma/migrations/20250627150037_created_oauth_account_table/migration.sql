/*
  Warnings:

  - You are about to drop the column `access_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OAUTH_PROVIDER" AS ENUM ('GITHUB');

-- DropIndex
DROP INDEX "users_provider_provider_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "access_token",
DROP COLUMN "provider",
DROP COLUMN "provider_id";

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "OAUTH_PROVIDER" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_id_key" ON "oauth_accounts"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
