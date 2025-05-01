import { Movie } from '@prisma/client';
import prisma from '../../shared/prisma';

const addAMovie = async (movieData: Movie) => {
  const result = await prisma.movie.create({
    data: movieData,
  });
  return result;
};

const getAllMovie = async () => {
    const result = await prisma.movie.findMany({
        where: {
            isDeleted: false
        }
    });
    return result;
  };

const updateAMovie = async (id:string, payload:any) => {
    const findUser = await prisma.movie.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    const result = await prisma.movie.update({
        where: {
            id,
            isDeleted: false
        },data: payload
    });
    return result;
  };

export const movieService = {
  addAMovie,
  getAllMovie
};
