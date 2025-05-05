/* eslint-disable @typescript-eslint/no-unused-vars */
import { Movie, Prisma } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';
import { TMovieFilterRequest } from './movie.interface';
import { movieFilterableFields, movieSearchAbleFields } from './movie.const';
import AppError from '../../error/AppError';

const addAMovie = async (movieData: Movie) => {

  const result = await prisma.movie.create({
    data: movieData,
  });
  return result;
};

// ***************** sortby ******************
// * latest, Recent (newest first)
// * Top Rated (highest average rating)
// * Most Liked (reviews with the most likes)

// ***************** search *****************
// Search bar with filters (genre, streaming platform, release year).

// ****************** filterBy ******************
// Genre (e.g., Action, Drama)
// Rating range (e.g., 7+ stars) pore
// Streaming platform (e.g., Netflix, Disney+)

const getAllMovie = async (
  params: TMovieFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.MovieWhereInput[] = [];

  if (params?.searchTerm) {
    andConditions.push({
      OR: movieSearchAbleFields.map(({ field, operator }) => {
        if (operator === 'equals') {
          const numericValue =
            typeof searchTerm === 'number'
              ? searchTerm
              : parseInt(String(searchTerm));
          if (isNaN(numericValue)) return {};
          return {
            [field]: {
              equals: numericValue,
            },
          };
        }

        if (operator === 'hasSome') {
          const arrayValue = [String(searchTerm)];

          return {
            [field]: {
              hasSome: arrayValue,
            },
          };
        }

        if (operator === 'contains') {
          return {
            [field]: {
              contains: String(searchTerm),
              mode: 'insensitive',
            },
          };
        }

        return {};
      }),
    });
  }

  // Filter by genres, platforms, and rating
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        const value = (filterData as any)[key];
        const valuesArray = String(value)
          .split(',')
          .map((v) => v.trim());
        return {
          [key]: {
            hasSome: valuesArray,
          },
        };
      }),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.MovieWhereInput = { AND: andConditions };

  const result = await prisma.movie.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.movie.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAMovie = async (
  id: string,
  options: IPaginationOptions,
  userId?: string,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(
    options || {},
  );

  //  Step 1: Review condition 
  type ReviewCondition =
    | { approved: boolean }
    | { userId: string; approved: boolean };

  const reviewOrConditions: ReviewCondition[] = [{ approved: true }];
  if (userId) {
    reviewOrConditions.push({ userId, approved: false });
  }
  const reviewWhereConditions = {
    OR: reviewOrConditions,
    movieId: id,
    // user: { status: UserStatus.ACTIVE },
  };

  //  Step 2: Fetch movie details with paginated reviews
  const result = await prisma.movie.findUnique({
    where: { id, isDeleted: false },
    select: {
      id: true,
      title: true,
      synopsis: true,
      genres: true,
      type: true,
      releaseYear: true,
      director: true,
      cast: true,
      platforms: true,
      buyPrice: true,
      rentPrice: true,
      streamingLink: true,
      isTrending: true,
      thumbnail: true,
      discountPrice: true,
      reviews: {
        where: {
          OR: reviewOrConditions,
          movieId: id,
        },
        skip,
        take: limit,
        orderBy:
          options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        select: {
          id: true,
          rating: true,
          content: true,
          tags: true,
          hasSpoiler: true,
          approved: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(404, 'Movie not found');
  }

  //  Step 3: Count total reviews for pagination
  const total = await prisma.review.count({
    where: reviewWhereConditions,
  });

  return {
    meta: {
      page,
      limit,
      TotalReview:total,
    },
    data: result,
  };
};

const updateAMovie = async (id: string, payload: any) => {
  await prisma.movie.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.movie.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
  });
  return result;
};

const deleteAMovie = async (id: string) => {
  await prisma.movie.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.movie.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      isDeleted: true,
    },
  });
  return result;
};

export const movieService = {
  addAMovie,
  getAllMovie,
  getAMovie,
  updateAMovie,
  deleteAMovie,
};
