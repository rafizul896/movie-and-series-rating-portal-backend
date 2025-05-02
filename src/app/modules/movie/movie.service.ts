/* eslint-disable @typescript-eslint/no-unused-vars */
import { Movie, Prisma, UserStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../helpers/paginationHelpers';
import { TMovieFilterRequest } from './movie.interface';
import { movieFilterableFields } from './movie.const';
import AppError from '../../errors/AppError';

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
      OR: movieFilterableFields.map(({ field, operator }) => {
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

  // const result = await prisma.movie.findMany({
  //   where: {
  //     isDeleted: false,
  //   },
  // });
  // return result;
};

const getAMovie = async (id: string) => {
  const result = await prisma.movie.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      reviews: {
        where: {
          approved: true,
          user: {
            status: UserStatus.ACTIVE,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              role: true,
              status: true,
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new AppError(404, 'Movie not found');
  }
  return result;
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
