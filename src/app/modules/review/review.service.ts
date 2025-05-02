import { Review } from '@prisma/client';
import prisma from '../../shared/prisma';

const createReview = async (payload:Review) => {
console.log(payload)
  // const result = await prisma.review.create({
  //   data: payload,
  // });
  return null;
};

// const getAllMovie = async () => {
//   const result = await prisma.movie.findMany({
//     where: {
//       isDeleted: false,
//     },
//   });
//   return result;
// };

// const updateAMovie = async (id: string, payload: any) => {
//   await prisma.movie.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });
//   const result = await prisma.movie.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: payload,
//   });
//   return result;
// };

// const deleteAMovie = async (id: string) => {
//   await prisma.movie.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });
//   const result = await prisma.movie.update({
//     where: {
//       id,
//       isDeleted: false,
//     },
//     data: {
//       isDeleted: true,
//     },
//   });
//   return result;
// };

export const reviewService = {
  createReview,
  // getAllMovie,
  // updateAMovie,
  // deleteAMovie
};
