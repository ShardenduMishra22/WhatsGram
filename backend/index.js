import messageRouter from "./routes/messageUser.js";
import authRouter from "./routes/authUser.js";
import userRouter from "./routes/chatUser.js";
import dbConnect from "./db/dbConnect.js";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import express from "express";
import dotenv from "dotenv";

dotenv.config(); // To use the .env file

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Ensure this is used before your routes

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use('/api/user',userRouter);


app.get("/", (req, res) => {
    res.send({ message: "Pulling Up Finna get Busy" });
});

app.listen(port, () => {
    dbConnect();
    console.log(`Server is running on port http://localhost:${port}`);
});


// import authRouter from "./routes/authUser.js";
// import messageRouter from "./routes/messageUser.js"
// import dbConnect from "./db/dbConnect.js";
// import cookieParser from "cookie-parser";
// import bodyParser from 'body-parser';
// import express from "express";
// import dotenv from "dotenv";

// const port = process.env.PORT || 3000
// const app = express();

// dotenv.config(); // To use the .env file

// // for some reason at night this app was working wihtout the line below
// // but in the morning it wasnt working without the line below
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.use("/api/auth",authRouter);
// app.use("/api/message",messageRouter);
// app.use(cookieParser());
// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send(JSON.parse('{"message": "Pulling Up Finna get Busy"}'))
// })

// app.listen(port, () => {
//     dbConnect();
//     console.log(`Server is running on port http://localhost:${port}`);
// });
