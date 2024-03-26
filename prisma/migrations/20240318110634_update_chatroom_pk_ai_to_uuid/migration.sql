/*
  Warnings:

  - The primary key for the `Chatroom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChatroomMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChatroomParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChatroomParticipants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatroomId,memberId]` on the table `ChatroomParticipants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChatroomMessage" DROP CONSTRAINT "ChatroomMessage_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomParticipants" DROP CONSTRAINT "ChatroomParticipants_chatroomId_fkey";

-- AlterTable
ALTER TABLE "Chatroom" DROP CONSTRAINT "Chatroom_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Chatroom_id_seq";

-- AlterTable
ALTER TABLE "ChatroomMessage" DROP CONSTRAINT "ChatroomMessage_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatroomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ChatroomMessage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ChatroomMessage_id_seq";

-- AlterTable
ALTER TABLE "ChatroomParticipants" DROP CONSTRAINT "ChatroomParticipants_pkey",
DROP COLUMN "id",
ALTER COLUMN "chatroomId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChatroomParticipants_chatroomId_memberId_key" ON "ChatroomParticipants"("chatroomId", "memberId");

-- AddForeignKey
ALTER TABLE "ChatroomParticipants" ADD CONSTRAINT "ChatroomParticipants_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomMessage" ADD CONSTRAINT "ChatroomMessage_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
