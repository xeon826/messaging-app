import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';

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
        }
      }
    }
  });
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
            in: [user1, user2]
          }
        }
      }
    },
    include: {
      users: true
    }
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
          { userId: user2, joinedAt: new Date() }
        ]
      }
    },
    include: {
      users: true
    }
  });
}

// export async function getMessages(
//   userId?: string,
//   count = 25,
// ) {
//   if (userId) {
//     // Get private messages between two users
//     return prisma.message.findMany({
//       where: {
//         OR: [
//           { AND: [{ user: userId }, { receiverId: { not: null } }] },
//           { AND: [{ user: { not: userId } }, { receiverId: userId }] },
//         ],
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//       take: count,
//     });
//   }

//   // Get public messages
//   return prisma.message.findMany({
//     where: {
//       receiverId: null,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//     take: count,
//   });
// }

export async function getMessages(
  // chatId: string,
  count = 25,
) {
  return prisma.message.findMany({
    // where: {
    //   chatId: chatId,
    // },
    orderBy: {
      createdAt: "asc",
    },
    take: count,
    // include: {
    //   sender: {
    //     select: {
    //       id: true,
    //       name: true,
    //       avatar: true,
    //     }
    //   }
    // }
  });
}
