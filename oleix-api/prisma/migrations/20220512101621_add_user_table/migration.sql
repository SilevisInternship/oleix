/*
  Warnings:

  - Added the required column `authorId` to the `Advert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localization` to the `Advert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Advert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Advert" ADD COLUMN     "authorId" VARCHAR(36) NOT NULL,
ADD COLUMN     "localization" VARCHAR(50) NOT NULL,
ADD COLUMN     "negotiable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" VARCHAR(16) NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" VARCHAR(40) NOT NULL,
    "localization" VARCHAR(80) NOT NULL,
    "phone" VARCHAR(16) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Advert" ADD CONSTRAINT "Advert_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
