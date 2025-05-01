import { Movie } from '@prisma/client';
import prisma from '../../shared/prisma';

const addAMovie = async (movieData: Movie) => {
  const result = await prisma.movie.create({
    data: movieData,
  });
  return result;
};

const getAllMovie = async (movieData: Movie) => {
    const result = await prisma.movie.create({
      data: movieData,
    });
    return result;
  };

export const movieService = {
  addAMovie,
};
