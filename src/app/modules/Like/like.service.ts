import prisma from "../../shared/prisma";

const toggleLike = async (userEmail: string, reviewId: string) => {

    // check if the user is authenticated
    const isUserExist = await prisma.user.findUniqueOrThrow({
        where: {
            email : userEmail
        },select: { id: true },
    })

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reviewId: {
          userId: isUserExist.id,
          reviewId,
        },
      },
    });
  
    if (existingLike) {
      // Unlike (delete)
      await prisma.like.delete({
        where: {
          userId_reviewId: {
            userId: isUserExist.id,
            reviewId,
          },
        },
      });
  
      return { liked: false };
    } else {
      // Like (create)
      await prisma.like.create({
        data: {
            userId: isUserExist.id,
          reviewId,
        },
      });
  
      return { liked: true };
    }
  };
  
  export const likeService = {
    toggleLike,
  };