/*
  Warnings:

  - A unique constraint covering the columns `[boardId,tagId]` on the table `BoardTag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guideId,languageCertificationId]` on the table `GuideLanguageCertification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `LanguageCertification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,languageId]` on the table `MemberLanguage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memberId,tagId]` on the table `MemberTag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GuideReview" ADD COLUMN     "guideId" INTEGER,
ADD COLUMN     "reviewerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "BoardTag_boardId_tagId_key" ON "BoardTag"("boardId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "GuideLanguageCertification_guideId_languageCertificationId_key" ON "GuideLanguageCertification"("guideId", "languageCertificationId");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageCertification_name_key" ON "LanguageCertification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemberLanguage_memberId_languageId_key" ON "MemberLanguage"("memberId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberTag_memberId_tagId_key" ON "MemberTag"("memberId", "tagId");

-- AddForeignKey
ALTER TABLE "GuideReview" ADD CONSTRAINT "GuideReview_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideReview" ADD CONSTRAINT "GuideReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
