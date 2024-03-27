/*
  Warnings:

  - The primary key for the `BoardLike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoardLike` table. All the data in the column will be lost.
  - The primary key for the `BoardTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BoardTag` table. All the data in the column will be lost.
  - The primary key for the `GuideLanguageCertification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GuideLanguageCertification` table. All the data in the column will be lost.
  - The primary key for the `MemberLanguage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MemberLanguage` table. All the data in the column will be lost.
  - The primary key for the `MemberTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MemberTag` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `PlanSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `period` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transport` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `Plan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dayScheduleId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Made the column `placeId` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PlanSchedule" DROP CONSTRAINT "PlanSchedule_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanSchedule" DROP CONSTRAINT "PlanSchedule_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_placeId_fkey";

-- AlterTable
ALTER TABLE "BoardLike" DROP CONSTRAINT "BoardLike_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "BoardTag" DROP CONSTRAINT "BoardTag_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "GuideLanguageCertification" DROP CONSTRAINT "GuideLanguageCertification_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "MemberLanguage" DROP CONSTRAINT "MemberLanguage_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "MemberTag" DROP CONSTRAINT "MemberTag_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "content",
ADD COLUMN     "period" INTEGER NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "transport" TEXT NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "description",
DROP COLUMN "endTime",
DROP COLUMN "name",
DROP COLUMN "startTime",
ADD COLUMN     "dayScheduleId" INTEGER NOT NULL,
ADD COLUMN     "nextLat" DOUBLE PRECISION,
ADD COLUMN     "nextLng" DOUBLE PRECISION,
ADD COLUMN     "nextPlaceId" INTEGER,
ADD COLUMN     "nextPlaceName" TEXT,
ADD COLUMN     "nextTime" TEXT,
ADD COLUMN     "stayTime" TEXT,
ALTER COLUMN "placeId" SET NOT NULL;

-- DropTable
DROP TABLE "PlanSchedule";

-- CreateTable
CREATE TABLE "DaySchedule" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "DaySchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySchedule" ADD CONSTRAINT "DaySchedule_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "DaySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
