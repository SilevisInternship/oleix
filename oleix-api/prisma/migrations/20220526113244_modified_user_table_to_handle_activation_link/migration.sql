/*
  Warnings:

  - The required column `activationUUID` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationUUID" VARCHAR(36) NOT NULL,
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "passwordHash" SET DATA TYPE VARCHAR(255);
