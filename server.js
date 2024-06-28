import express from 'express';
import serveIndex from 'serve-index';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
import usersRouter from './controllers/userController.js';
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'

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
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));

// Routes
app.use("/user", usersRouter);

app.listen(3000, () => console.log('app is listening on port 3000.'));