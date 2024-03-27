/*
  Warnings:

  - You are about to drop the column `temperatrue` on the `GuideProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GuideProfile" DROP COLUMN "temperatrue",
ADD COLUMN     "temperature" DOUBLE PRECISION DEFAULT 36.5;
