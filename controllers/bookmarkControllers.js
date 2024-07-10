import express from 'express';
const { PrismaClient } = require('@prisma/client')

const app = express()
app.use(express.json())

const prisma = new PrismaClient()

// Create a bookmark
app.post('/bookmarks', async (req, res) => {
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
app.get('/bookmarks', async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany()

    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Read a single bookmark
app.get('/bookmarks/:id', async (req, res) => {
  const { id } = req.params

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
    })

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json(bookmark)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a bookmark
app.put('/bookmarks/:id', async (req, res) => {
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
app.delete('/bookmarks/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})