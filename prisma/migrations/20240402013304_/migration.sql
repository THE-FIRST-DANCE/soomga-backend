/*
  Warnings:

  - You are about to drop the column `address` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the `MemberSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BoardStatus" AS ENUM ('ACTIVE', 'PROCESSING', 'COMPLETE');

-- AlterEnum
ALTER TYPE "AccessStatus" ADD VALUE 'GUIDES';

-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "address",
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION,
ADD COLUMN     "process" "BoardStatus" DEFAULT 'ACTIVE',
ALTER COLUMN "title" DROP NOT NULL;

-- DropTable
DROP TABLE "MemberSchedule";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberEvent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "allDay" BOOLEAN DEFAULT false,
    "description" TEXT,
    "planId" INTEGER,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "MemberEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEvent" ADD CONSTRAINT "MemberEvent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEvent" ADD CONSTRAINT "MemberEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
