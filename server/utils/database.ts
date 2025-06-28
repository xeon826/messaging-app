import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function addMessage(user: string, message: string, receiverId?: string) {
  return prisma.message.create({
    data: {
      user,
      message,
      receiverId
    }
  })
}

export async function getMessages(userId?: string, receiverId?: string, count = 25) {
  if (userId && receiverId) {
    // Get private messages between two users
    return prisma.message.findMany({
      where: {
        OR: [
          { AND: [{ user: userId }, { receiverId }] },
          { AND: [{ user: receiverId }, { receiverId: userId }] }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: count
    })
  }

  // Get public messages
  return prisma.message.findMany({
    where: {
      receiverId: null
    },
    orderBy: {
      createdAt: 'asc'
    },
    take: count
  })
}

