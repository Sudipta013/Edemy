import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

// initialize express app
const app = express();

// database connection
await connectDB();
// connect cloudinary
await connectCloudinary();

// middlewares
app.use(cors());
app.use(clerkMiddleware())

// routes
app.get("/", (req, res) => {
	res.send("Hello from server");
});
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(),educatorRouter);

//PORT
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
