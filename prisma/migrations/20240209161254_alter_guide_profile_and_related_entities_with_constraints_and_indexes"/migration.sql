/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `GuideProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId]` on the table `GuideProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `GuideProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BoardLike" DROP CONSTRAINT "BoardLike_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardLike" DROP CONSTRAINT "BoardLike_memberId_fkey";

-- DropForeignKey
ALTER TABLE "BoardTag" DROP CONSTRAINT "BoardTag_boardId_fkey";

-- DropForeignKey
ALTER TABLE "BoardTag" DROP CONSTRAINT "BoardTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomParticipants" DROP CONSTRAINT "ChatroomParticipants_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomParticipants" DROP CONSTRAINT "ChatroomParticipants_memberId_fkey";

-- DropForeignKey
ALTER TABLE "GuideLanguageCertification" DROP CONSTRAINT "GuideLanguageCertification_guideId_fkey";

-- DropForeignKey
ALTER TABLE "GuideLanguageCertification" DROP CONSTRAINT "GuideLanguageCertification_languageCertificationId_fkey";

-- DropForeignKey
ALTER TABLE "GuideProfile" DROP CONSTRAINT "GuideProfile_id_fkey";

-- DropForeignKey
ALTER TABLE "LanguageCertification" DROP CONSTRAINT "LanguageCertification_languageId_fkey";

-- DropForeignKey
ALTER TABLE "MemberLanguage" DROP CONSTRAINT "MemberLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "MemberLanguage" DROP CONSTRAINT "MemberLanguage_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSchedule" DROP CONSTRAINT "MemberSchedule_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "MemberTag" DROP CONSTRAINT "MemberTag_memberId_fkey";

-- DropForeignKey
ALTER TABLE "MemberTag" DROP CONSTRAINT "MemberTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "PlaceReview" DROP CONSTRAINT "PlaceReview_placeId_fkey";

-- DropForeignKey
ALTER TABLE "PlanSchedule" DROP CONSTRAINT "PlanSchedule_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanSchedule" DROP CONSTRAINT "PlanSchedule_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "address" TEXT,
ADD COLUMN     "overview" TEXT,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'TRIP',
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
CREATE SEQUENCE guideprofile_id_seq;
ALTER TABLE "GuideProfile" ADD COLUMN     "memberId" INTEGER NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBankAccount" BOOLEAN DEFAULT false,
ADD COLUMN     "verifiedID" BOOLEAN DEFAULT false,
ALTER COLUMN "id" SET DEFAULT nextval('guideprofile_id_seq'),
ALTER COLUMN "temperatrue" DROP NOT NULL,
ALTER COLUMN "service" DROP NOT NULL;
ALTER SEQUENCE guideprofile_id_seq OWNED BY "GuideProfile"."id";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "gender" "Gender";

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideArea" (
    "id" SERIAL NOT NULL,
    "guideId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,

    CONSTRAINT "GuideArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GuideProfile_phoneNumber_key" ON "GuideProfile"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GuideProfile_memberId_key" ON "GuideProfile"("memberId");

-- AddForeignKey
ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardLike" ADD CONSTRAINT "BoardLike_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardLike" ADD CONSTRAINT "BoardLike_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTag" ADD CONSTRAINT "MemberTag_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTag" ADD CONSTRAINT "MemberTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardTag" ADD CONSTRAINT "BoardTag_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardTag" ADD CONSTRAINT "BoardTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberLanguage" ADD CONSTRAINT "MemberLanguage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberLanguage" ADD CONSTRAINT "MemberLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageCertification" ADD CONSTRAINT "LanguageCertification_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideLanguageCertification" ADD CONSTRAINT "GuideLanguageCertification_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideLanguageCertification" ADD CONSTRAINT "GuideLanguageCertification_languageCertificationId_fkey" FOREIGN KEY ("languageCertificationId") REFERENCES "LanguageCertification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSchedule" ADD CONSTRAINT "PlanSchedule_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanSchedule" ADD CONSTRAINT "PlanSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSchedule" ADD CONSTRAINT "MemberSchedule_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSchedule" ADD CONSTRAINT "MemberSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomParticipants" ADD CONSTRAINT "ChatroomParticipants_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatroomParticipants" ADD CONSTRAINT "ChatroomParticipants_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideArea" ADD CONSTRAINT "GuideArea_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideArea" ADD CONSTRAINT "GuideArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;
