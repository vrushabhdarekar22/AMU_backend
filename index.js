require("dotenv").config({ override: true });

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const userRouter = require("./routes/user")
const animalRouter = require("./routes/animal");
const {checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB Atlas connected"));


app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use('/user',userRouter);
app.use('/animal',animalRouter);

app.listen(PORT,()=>console.log(`server started at port :${PORT}`));