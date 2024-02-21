/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `BoardLike` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BoardLike` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BoardLike" DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "birthdate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER',
ALTER COLUMN "deletedAt" DROP DEFAULT;
