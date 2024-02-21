/*
  Warnings:

  - A unique constraint covering the columns `[boardId,memberId]` on the table `BoardLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BoardLike_boardId_memberId_key" ON "BoardLike"("boardId", "memberId");
