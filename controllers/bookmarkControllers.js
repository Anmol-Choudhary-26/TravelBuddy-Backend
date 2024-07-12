import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Create a bookmark
router.post('/', async (req, res) => {
  const { postId, userId } = req.body

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        postId,
        userId,
      },
    })

    res.status(201).json(bookmark)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Read all bookmarks
router.get('/getbookmark', async (req, res) => {
  try {
    const { userId } = req.params;

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        post: true,
      },
    });

    const posts = bookmarks.map((bookmark) => bookmark.post);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a bookmark
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { postId, userId } = req.body

  try {
    const updatedBookmark = await prisma.bookmark.update({
      where: { id },
      data: {
        postId,
        userId,
      },
    })

    res.json(updatedBookmark)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a bookmark
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await prisma.bookmark.delete({
      where: { id },
    })

    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


export default router;