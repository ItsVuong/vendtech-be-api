const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const router = require("./routes/routes")

//config environment variables
dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(router)

//connect to database
mongoose.connect('mongodb://localhost:27017/vendtech', { dbName: "vend-tech" })
    .then(() => console.log('connected to database'))
    .catch(() => 'error connecting to database')

app.listen(PORT, () => {
    console.log('App running on port ' + PORT)
});