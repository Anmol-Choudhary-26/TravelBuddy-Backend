import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
// Create a new post
router.post('/', async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: req.body,
    });

    res.status(200).json(post);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to post post.' })
  }
}
)

// Get all posts
router.get('/allpost', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    res.status(200).json(posts);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error })
  }
})

router.post('/like/:id?', async (req, res) => {
  try {
    
    const { id, userId } = req.params;
    
    // Check if the user has already liked the post
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: id,
        userId: userId,
      },
    });

    if (existingLike) {
      // If the user has already liked the post, delete the like
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
    } else {
      // If the user has not liked the post, create a new like
      await prisma.like.create({
        data: {
          postId: id,
          userId: userId,
        },
      });
    }

    // Get the updated number of likes for the post
    const likesCount = await prisma.like.count({
      where: { postId: id },
    });

    res.status(200).json({ likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

router.get('/search', async (req, res) => {
  try {
     const {startDate, endDate, caption} = req.query;
     const formattedstart = startDate ? startDate : '1999-01-01'
     const formattedend = endDate? endDate : '2100-12-31'
     console.log(caption);
      const posts = await prisma.post.findMany({
        where: {
          caption: {
              contains: caption,
          },
          createdAt: {
            gte: `${formattedstart}T00:00:00z`,
            lt: `${formattedend}T00:00:00z`,
        },
        }
      });

      res.status(200).json(posts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Get a single post by ID
router.get('/:id?', async (req, res) => {
  try {
    const { id } = req.params
    const post = await prisma.post.findUnique({
      where: { id },
    });

    res.status(200).json(post);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get post.' })
  }
})

// Update a post by ID
router.put('/:id?', async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);
    const post = await prisma.post.update({
      where: { id },
      data: req.body
    });

    res.status(201).json(post);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error })
  }
})

// Delete a post by ID
router.delete('/:id?', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.post.delete({
      where: { id },
    });
    res.status(204).json("post deleted")
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete post.' })
  }
})

// Add a new route to like a post


router.get('/like/:id?', async (req, res) => {
  try{
    // Get the updated number of likes for the post
    const likesCount = await prisma.like.count({
      where: { postId: id },
    });

    res.status(200).json({ likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Add a new route to bookmark a post
router.post('/bookmark/:id?', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming the user's ID is passed in the request body

    // Check if the user has already bookmarked the post
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        postId: id,
        userId: userId,
      },
    });

    if (existingBookmark) {
      // If the user has already bookmarked the post, delete the bookmark
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
    } else {
      // If the user has not bookmarked the post, create a new bookmark
      await prisma.bookmark.create({
        data: {
          postId: id,
          userId: userId,
        },
      });
    }

    // Get the updated number of bookmarks for the post
    const bookmarksCount = await prisma.bookmark.count({
      where: { postId: id },
    });

    res.status(200).json({ bookmarksCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;