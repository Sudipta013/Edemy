import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

// initialize express app
const app = express();

// database connection
await connectDB();

// middlewares
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.send('Hello from server');
})
app.post('/clerk', express.json(), clerkWebhooks);

//PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})