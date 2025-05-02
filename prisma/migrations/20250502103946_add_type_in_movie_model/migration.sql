-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'SERIES');

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT 'MOVIE';
