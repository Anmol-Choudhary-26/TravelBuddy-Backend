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

export default router;