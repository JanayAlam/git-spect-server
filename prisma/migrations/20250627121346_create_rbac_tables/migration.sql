/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('ACTIVE', 'BANNED', 'DISABLED');

-- CreateEnum
CREATE TYPE "PERMISSION_RESOURCE" AS ENUM ('USER', 'ROLE', 'USER_ROLES', 'PERMISSION', 'ROLE_PERMISSIONS');

-- CreateEnum
CREATE TYPE "PERMISSION_ACTION" AS ENUM ('READ', 'WRITE', 'UPDATE', 'DELETE', 'MANAGE');

-- CreateEnum
CREATE TYPE "PERMISSION_TYPE" AS ENUM ('ALLOW', 'DENY', 'RESTRICT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "provider_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_status" "USER_STATUS" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "description" VARCHAR(255),
    "role_weight" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(15) NOT NULL,
    "description" VARCHAR(255),
    "resource" "PERMISSION_RESOURCE" NOT NULL,
    "action" "PERMISSION_ACTION" NOT NULL,
    "requires_ownership" BOOLEAN NOT NULL DEFAULT false,
    "max_weight" INTEGER,
    "min_weight" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "permission_type" "PERMISSION_TYPE" NOT NULL DEFAULT 'ALLOW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_role_weight_idx" ON "Role"("role_weight");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "Permission_resource_idx" ON "Permission"("resource");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resource_action_key" ON "Permission"("resource", "action");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_provider_id_key" ON "User"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
