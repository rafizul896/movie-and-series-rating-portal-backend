/*
  Warnings:

  - Made the column `thumbnail` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "thumbnail" SET NOT NULL;
