import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Delete or create a bookmark
router.post('/', async (req, res) => {
   console.log("params", req.params)
   console.log("query", req.query)
   console.log("req", req)

  const { postId, userId } = req.params;

  try {
    // Check if a bookmark exists for the given postId and userId
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { postId, userId },
    });

    if (existingBookmark) {
      // If a bookmark exists, delete it
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
    } else {
      // If no bookmark exists, create a new one
      const newBookmark = await prisma.bookmark.create({
        data: {
          postId,
          userId,
        },
      });
    }

    res.status(200).json({ message: 'Bookmark updated successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
});


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
    console.log(error);
    res.status(500).json( error );
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