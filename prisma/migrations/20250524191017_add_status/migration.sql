/*
  Warnings:

  - The `status` column on the `newsletter_subscribers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `newsletters` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NewsletterSubscriberStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT');

-- AlterTable
ALTER TABLE "newsletter_subscribers" DROP COLUMN "status",
ADD COLUMN     "status" "NewsletterSubscriberStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "newsletters" DROP COLUMN "status",
ADD COLUMN     "status" "NewsletterStatus" NOT NULL DEFAULT 'DRAFT';
