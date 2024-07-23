import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });

    res.status(200).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to post user.' })
  }
}
)

// Get all users
router.get('/allusers', async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error })
  }
})

router.get('/email/:email?', async (req, res) => {
  try {
    const { email } = req.query
    const user = await prisma.user.findUnique({
      where: { email },
    });

    res.status(200).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get user.' })
  }
})


// Get a single user by ID
router.get('/:id?', async (req, res) => {
  try {
    const { id } = req.query
    const user = await prisma.user.findUnique({
      where: { id },
    });

    res.status(200).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get user.' })
  }
})

// Update a user by ID
router.put('/:id?', async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);
    const user = await prisma.user.update({
      where: { id },
      data: req.body
    });

    res.status(201).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: error })
  }
})

// Delete a user by ID
router.delete('/:id?', async (req, res) => {
  try {
    const { id } = req.query
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).json("User deleted")
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete user.' })
  }
})

export default router;