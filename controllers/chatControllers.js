import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Create a new chat room
router.post("/", async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    const chat = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { AND: [{ user1: firstId }, { user2: secondId }] },
          { AND: [{ user1: secondId }, { user2: firstId }] },
        ],
      },
    });
    if (chat) return res.status(200).json(chat);

    const chatRoom = await prisma.chatRoom.create({
      data: {
        user1: firstId,
        user2: secondId,
      },
    });

    res.status(200).json(chatRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/getchats", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(userId)

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        OR: [{ user1: userId }, { user2: userId }],
      },
    });

    res.status(200).json(chatRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
router.get('/singlechat', async (req, res) => {
  try{
    const { firstId, secondId } = req.body;

    const chat = await prisma.chatRoom.findFirst({
      where: {
        OR: [
          { AND: [{ user1: firstId }, { user2: secondId }] },
          { AND: [{ user1: secondId }, { user2: firstId }] },
        ],
      },
    });
    if (chat) return res.status(200).json(chat);
  }
  catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

export default router;
