import express from "express";
const app = express();

import dotenv from "dotenv";
const port = process.env.PORT || 3000
dotenv.config(); // To use the .env file


app.get("/", (req, res) => {
    res.send("Server Is Working Properly Bhai!");
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
