/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "purchase_userId_movieId_key" ON "purchase"("userId", "movieId");
