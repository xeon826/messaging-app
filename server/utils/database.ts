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
      AND: [
        {
          users: {
            some: {
              userId: user1,
            },
          },
        },
        {
          users: {
            some: {
              userId: user2,
            },
          },
        },
      ],
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
  var chat = await createOrFindChat(users);
  console.log("the chat id", chat.id);
  const result = prisma.message.findMany({
    where: {
      chatId: chat.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: count,
    include: {
      sender: {
        select: {
          username: true,
        },
      },
    },
  });
  return result;
}

export async function markMessagesAsRead(userId, messageIds) {
  try {
    // Ensure messageIds is an array
    if (!Array.isArray(messageIds)) {
      throw new Error("messageIds should be an array.");
    }

    const readReceipts = await Promise.all(
      messageIds.map(async (messageId) => {
        return prisma.readReceipt.upsert({
          where: {
            userId_messageId: {
              userId: userId,
              messageId: +messageId,
            },
          },
          update: {
            readAt: new Date(), // Update the read timestamp if it already exists
          },
          create: {
            userId: userId,
            messageId: +messageId,
            readAt: new Date(), // Set the read timestamp for the first time
          },
        });
      }),
    );

    console.log("Messages marked as read:", readReceipts);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUnreadMessages(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID must be provided");
    }

    // Retrieve messages that do not have a read receipt for the user
    const unreadMessages = await prisma.message.findMany({
      where: {
        AND: [
          {
            chat: {
              users: {
                some: {
                  userId: userId, // Check if user is part of the chat
                },
              },
            },
          },
          {
            reads: {
              none: {
                userId: userId, // Check for the absence of a read receipt
              },
            },
          },
          {
            NOT: {
              userId: userId, // Exclude messages sent by the user themselves using `NOT`
            },
          },
        ],
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
    return unreadMessages;
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    throw new Error("Failed to fetch unread messages");
  } finally {
    // Disconnect the Prisma client instance to prevent connection leaks
    await prisma.$disconnect();
  }
}
