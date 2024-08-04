import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
router.post("/", async (req, res) => {
  try {
    const { firstId, user1Name, user2Name, secondId } = req.body;

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
        user1Name,
        user2Name,
      },
    });

    res.status(200).json(chatRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/getchats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

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

router.get("/singlechat", async (req, res) => {
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
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post("/msg", async (req, res) => {
  try {
    const { userId, roomid, message } = req.body;

    const newMessage = await prisma.msg.create({
      data: {
        chatRoomId: roomid,
        userId: userId,
        message: message,
      },
    });

    res.status(200).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get("/messages", async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const messages = await prisma.msg.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;
