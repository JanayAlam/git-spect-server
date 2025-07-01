/*
  Warnings:

  - You are about to drop the column `expires_at` on the `oauth_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `oauth_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "oauth_accounts" DROP COLUMN "expires_at",
DROP COLUMN "refresh_token";
