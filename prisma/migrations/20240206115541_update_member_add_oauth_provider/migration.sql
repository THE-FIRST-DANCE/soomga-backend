-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "provider" TEXT DEFAULT 'local',
ADD COLUMN     "providerId" TEXT;
