/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `watchlists` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "watchlists_userId_movieId_key" ON "watchlists"("userId", "movieId");
