import express from 'express';
import serveIndex from 'serve-index';
import { MongoClient, ServerApiVersion } from 'mongodb';
const app = express();
import usersRouter from './controllers/userController.js';

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));

// Routes
app.use("/user", usersRouter);

app.get('/', (req, res) => {
    res.send('Successful response.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));