/*
  Warnings:

  - You are about to drop the column `max_weight` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `min_weight` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `role_weight` on the `roles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "roles_role_weight_idx";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "max_weight",
DROP COLUMN "min_weight";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "role_weight";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" VARCHAR(255);

-- CreateIndex
CREATE INDEX "permissions_name_idx" ON "permissions"("name");
