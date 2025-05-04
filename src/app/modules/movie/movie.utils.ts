import prisma from "../../shared/prisma";

export const updateMovieReviewRatingStats = async (movieId: string) => {
  console.log("movieId", movieId);
  const stats = await prisma.review.aggregate({
    where: {
      movieId,
      approved: true,
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });
console.log("stats", stats);
  await prisma.movie.update({
    where: { id: movieId },
    data: {
      avgRating: stats._avg.rating ?? 0,
      reviewCount: stats._count.id,
    },
  });
};
