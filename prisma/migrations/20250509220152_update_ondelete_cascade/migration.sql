-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
