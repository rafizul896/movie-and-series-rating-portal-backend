import prisma from "../../shared/prisma";

export const updateMovieReviewRatingStats = async (movieId: string) => {
  const stats = await prisma.review.aggregate({
    where: {
      movieId,
      approved: true,
    },
    _sum: {
      rating: true,
    },
    _avg: {
      rating: true,
    },
    _count: {
      id: true,
    },
  });
  await prisma.movie.update({
    where: { id: movieId },
    data: {
      totalRating: stats._sum.rating ?? 0,
      avgRating: stats._avg.rating ?? 0,
      reviewCount: stats._count.id,
    },
  });
};
