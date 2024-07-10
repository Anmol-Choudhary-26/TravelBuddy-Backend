import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
import usersRouter from './controllers/userController.js';
import postRouter from './controllers/postController.js';
import chatRouter from './controllers/chatControllers.js';
import bookmarkRouter from './controllers/bookmarkControllers.js';
import dotenv from 'dotenv'
dotenv.config()

// connected to database
const client = new MongoClient(
    process.env.MONGO_URL,
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    }
);

// middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(express.json());


// Routes
app.use("/user", usersRouter);
app.use("/post", postRouter);
app.use('/chat', chatRouter);
app.use('/bookmark', bookmarkRouter);

app.listen(8000, () => console.log('app is listening on port 8000.'));