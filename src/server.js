import express from "express";
import dotenv from "dotenv"

const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Well hello there");
})

app.listen(PORT, () => {
    console.log('App running on port ' + PORT)
})