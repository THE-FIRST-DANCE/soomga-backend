/*
  Warnings:

  - You are about to drop the `MemberSchedule` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "url" TEXT;

-- DropTable
DROP TABLE "MemberSchedule";

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

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardFile" (
    "boardId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardFile_boardId_fileId_key" ON "BoardFile"("boardId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_url_key" ON "Board"("url");

-- AddForeignKey
ALTER TABLE "MemberEvent" ADD CONSTRAINT "MemberEvent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberEvent" ADD CONSTRAINT "MemberEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardFile" ADD CONSTRAINT "BoardFile_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardFile" ADD CONSTRAINT "BoardFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
