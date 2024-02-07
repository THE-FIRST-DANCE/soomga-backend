/*
  Warnings:

  - The `provider` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE', 'LINE');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "avatar" TEXT,
DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" DEFAULT 'LOCAL';
