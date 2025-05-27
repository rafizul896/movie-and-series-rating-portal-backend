-- DropForeignKey
ALTER TABLE "newsletter_recipients" DROP CONSTRAINT "newsletter_recipients_newsletterId_fkey";

-- DropForeignKey
ALTER TABLE "newsletter_recipients" DROP CONSTRAINT "newsletter_recipients_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "newsletter_subscribers" DROP CONSTRAINT "newsletter_subscribers_userId_fkey";

-- AddForeignKey
ALTER TABLE "newsletter_subscribers" ADD CONSTRAINT "newsletter_subscribers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_recipients" ADD CONSTRAINT "newsletter_recipients_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "newsletter_recipients" ADD CONSTRAINT "newsletter_recipients_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "newsletter_subscribers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
