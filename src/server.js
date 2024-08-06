const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const router = require("./routes/routes")
const errorMiddleware = require("./middlewares/error.middleware")
const cors = require("cors");
//config environment variables
dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors())
app.use(router);
app.use(errorMiddleware);

//connect to database
mongoose.connect(process.env.MONGODB_KEY, { dbName: "vend-tech" })
    .then(() => console.log('connected to database'))
    .catch(() => 'error connecting to database')

app.listen(PORT, () => {
    console.log('App running on port ' + PORT)
});