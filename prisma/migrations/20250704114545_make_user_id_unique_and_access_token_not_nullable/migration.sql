/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `oauth_accounts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `access_token` on table `oauth_accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "oauth_accounts" ALTER COLUMN "access_token" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_user_id_key" ON "oauth_accounts"("user_id");
