import express from "express";
const app = express();

import dotenv from "dotenv";
const port = process.env.PORT || 3000
dotenv.config(); // To use the .env file

import dbConnect from "./db/dbConnect.js";

import authRouter from "./routes/authRouter.js";

app.use("/api/auth",authRouter)

app.listen(port, () => {
    dbConnect();
    console.log(`Server is running on port http://localhost:${port}`);
});
