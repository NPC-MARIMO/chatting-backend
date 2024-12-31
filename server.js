const express = require("express")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
require('dotenv').config();
const cors = require("cors")

const authRouter = require('./routes/auth/auth.route')

const app = express();

// db
mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("db connected"))
    .catch(e => console.log(e))
;

const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Specific frontend URL
    credentials: true // Allow cookies, authorization headers, etc.
  }));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter); 

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})