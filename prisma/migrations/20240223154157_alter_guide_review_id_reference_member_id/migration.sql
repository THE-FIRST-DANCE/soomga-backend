/*
  Warnings:

  - You are about to drop the column `memberId` on the `GuideProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuideProfile" DROP CONSTRAINT "GuideProfile_memberId_fkey";

-- DropIndex
DROP INDEX "GuideProfile_memberId_key";

-- AlterTable
ALTER TABLE "GuideProfile" DROP COLUMN "memberId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "guideprofile_id_seq";

-- AddForeignKey
ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
