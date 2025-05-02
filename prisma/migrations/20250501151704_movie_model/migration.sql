-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "genres" TEXT[],
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT[],
    "platforms" TEXT[],
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "rentPrice" DOUBLE PRECISION NOT NULL,
    "streamingLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);
