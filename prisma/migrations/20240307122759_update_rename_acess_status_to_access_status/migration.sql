/*
  Warnings:

  - The `status` column on the `Board` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'DELETED');

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "status",
ADD COLUMN     "status" "AccessStatus" DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "status",
ADD COLUMN     "status" "AccessStatus" NOT NULL DEFAULT 'PUBLIC';

-- DropEnum
DROP TYPE "AcessStatus";
