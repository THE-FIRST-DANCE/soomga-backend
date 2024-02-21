/*
  Warnings:

  - A unique constraint covering the columns `[placeId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placeId` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlaceReview" DROP CONSTRAINT "PlaceReview_placeId_fkey";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "detailAddress" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "placeId" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OpeningHours" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "OpeningHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_placeId_key" ON "Place"("placeId");

-- AddForeignKey
ALTER TABLE "OpeningHours" ADD CONSTRAINT "OpeningHours_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
