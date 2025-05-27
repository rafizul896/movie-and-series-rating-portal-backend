import status from 'http-status';
import { NewsletterSubscriber } from '@prisma/client';
import prisma from '../../shared/prisma';
import sendEmail from '../../utils/sendEmail';
import AppError from '../../error/AppError';

const createNewsletter = async (data: {
  title: string;
  subject: string;
  content: string;
  scheduledAt?: Date;
}) => {
  // console.log('Creating newsletter with data:', data);
  return await prisma.newsletter.create({
    data: {
      ...data,
      recipientCount: 0,
    },
  });
};

const getAllNewsletters = async () => {
  return await prisma.newsletter.findMany({
    orderBy: { createdAt: 'desc' },
  });
};
const getUserNewsletters = async (userId: string) => {

  const newsletterRecipientRecord:any =  prisma.newsletterRecipient.findMany({
    where: {
      Subscriber: {
        userId: userId
      }
    },
    select: {
      createdAt: true,
      Newsletter: {
        select: {
          id: true,
          title: true,
          subject: true,
          content: true,
          status: true
        },
      },
      Subscriber: {
        select: {
          email: true,
          name: true,
        },
      },
    }
  });

  if(!newsletterRecipientRecord || newsletterRecipientRecord?.length === 0) {
    throw new AppError(status.NOT_FOUND, 'No newsletters found for this user');
  }
  return newsletterRecipientRecord;
};

const getNewsletterById = async (id: string) => {
  return await prisma.newsletter.findUniqueOrThrow({ where: { id } });
};

const updateNewsletter = async (id: string, data: any) => {
  const existingNewsletter = await prisma.newsletter.findUnique({
    where: { id },
    include: { recipients: true },
  });

  if (!existingNewsletter) {
    return { success: false, message: 'Newsletter not found' };
  }

  const recipientCount = await prisma.newsletterRecipient.count({
    where: { newsletterId: id },
  });

  let status = existingNewsletter.status;
  if (status !== 'SENT') {
    status = data.isScheduled ? 'SCHEDULED' : 'DRAFT';
  }

  const updateData = {
    title: data.title,
    subject: data.subject,
    content: data.content,
    status,
    recipientCount,
    scheduledAt: data.isScheduled ? data.scheduledAt : null,
    isScheduled: data.isScheduled,
  };

  const updatedNewsletter = await prisma.newsletter.update({
    where: { id },
    data: updateData,
  });

  return updatedNewsletter;
};

const deleteNewsletter = async (id: string) => {
  await prisma.newsletter.findUniqueOrThrow({ where: { id } });
  const result = await prisma.newsletter.delete({ where: { id } });

  return result;
};

//User Subscribe/Unsubscribe
const subscribeToNewsletter = async (
  email: string,
  name?: string,
  userId?: string,
) => {
  return await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, name, userId, status: 'ACTIVE' },
    update: { status: 'ACTIVE', unsubscribedAt: null },
  });
};

const unsubscribeFromNewsletter = async (email: string) => {
  await prisma.newsletterSubscriber.findUniqueOrThrow({
    where: { email },
  });
  return await prisma.newsletterSubscriber.update({
    where: { email },
    data: {
      status: 'INACTIVE',
      unsubscribedAt: new Date(),
    },
  });
};

//Admin Email Sending Logic
const sendNewsletter = async (newsletterId: string) => {
  // console.log('Sending newsletter with ID:', newsletterId);
  const result = await prisma.$transaction(async (tx) => {
    const newsletter = await tx.newsletter.findUnique({
      where: { id: newsletterId },
    });

    if (!newsletter) {
      throw new AppError(status.NOT_FOUND, 'Newsletter not found');
    } else if (newsletter && newsletter?.status === 'SENT') {
      throw new AppError(
        status.BAD_REQUEST,
        'This Newsletter has already been send',
      );
    }
    const subscribers: NewsletterSubscriber[] =
      await tx.newsletterSubscriber.findMany({
        where: { status: 'ACTIVE' },
      });

    if (!newsletter || subscribers.length === 0)
      throw new Error('Invalid data');

    // Nodemailer config (Gmail example)
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    const sendPromises = subscribers?.map(
      async (subscriber) =>
        // transporter.sendMail({
        //   from: `"Giftly" <${process.env.EMAIL_USER}>`,
        //   to: subscriber.email,
        //   subject: newsletter.subject,
        //   html: `<h2>${newsletter.title}</h2><p>${newsletter.content}</p>`,
        // })
        await sendEmail(
          subscriber.email,
          `<h2>${newsletter.title}</h2><p>${newsletter.content}</p>`,
          newsletter.subject,
        ),
    );

    await Promise.all(sendPromises);

    const updatedNewsletter = await tx.newsletter.update({
      where: { id: newsletterId },
      data: {
        sentAt: new Date(),
        recipientCount: subscribers.length,
        status: 'SENT',
      },
    });

    // Save recipients
    const recipientRecords = subscribers.map((s) => ({
      newsletterId: newsletterId,
      subscriberId: s.id,
    }));

    await tx.newsletterRecipient.createMany({ data: recipientRecords });

    return updatedNewsletter;
  });
  return result;
};

export const NewsLetterService = {
  createNewsletter,
  getAllNewsletters,
  getNewsletterById,
  updateNewsletter,
  deleteNewsletter,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  sendNewsletter,
  getUserNewsletters
};
