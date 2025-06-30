import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { create } from "domain";

const prisma = new PrismaClient();

export async function addMessage(
  userId: string,
  chatId: string,
  message: string,
) {
  return prisma.message.create({
    data: {
      message,
      userId,
      chatId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

export async function createOrFindChat(users: [string, string]) {
  // Sort user IDs to ensure consistent ordering
  const [user1, user2] = users.sort();

  // First try to find existing chat between these users
  const existingChat = await prisma.chats.findFirst({
    where: {
      users: {
        every: {
          userId: {
            in: [user1, user2],
          },
        },
      },
    },
    include: {
      users: true,
    },
  });

  if (existingChat) {
    return existingChat;
  }

  // If no existing chat, create a new one with a unique ID
  const chatId = crypto.randomUUID();
  return prisma.chats.create({
    data: {
      id: chatId,
      users: {
        create: [
          { userId: user1, joinedAt: new Date() },
          { userId: user2, joinedAt: new Date() },
        ],
      },
    },
    include: {
      users: true,
    },
  });
}

export async function getMessages(users: [string, string], count = 25) {
  var chat = await createOrFindChat(users)
  const result = prisma.message.findMany({
    where: {
      chatId: chat.id
    },
    orderBy: {
      createdAt: "asc",
    },
    take: count,
    include: {
      sender: {
        select: {
          username: true,
        }
      }
    }
  });
  console.log('messages', result)
  return result;
}
