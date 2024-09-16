import authRouter from "./routes/authUser.js";
import dbConnect from "./db/dbConnect.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3000
const app = express();

dotenv.config(); // To use the .env file

app.use("/api/auth",authRouter);
app.use(cookieParser());
app.use(express.json());


app.listen(port, () => {
    dbConnect();
    console.log(`Server is running on port http://localhost:${port}`);
});
