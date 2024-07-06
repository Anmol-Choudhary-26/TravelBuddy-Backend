import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
// Create a new chat room
router.post('/',  async (req, res) => {
  const { users } = req.body;
  const chatRoom = await prisma.chatRoom.create({
    data: {
      users: {
        create: users.map((userId) => ({
          user: {
            connect: { id: userId },
          },
        })),
      },
    },
  });

  res.status(200).json(chatRoom);
}

)
// Send a message to a chat room
router.post('/msg', async (chatRoomId, userId, message) => {
  const msg = await prisma.msg.create({
    data: {
      message,
      chatRoomId,
      userId,
    },
  });

  res.status(200).json(msg);
}
)

export default router;