require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const hostname = require('./utils/addIPv4')
const catchError = require('./middlewares/catchError')

app.use(cors())
app.use(express.json());
const port = 3000



const userRouter = require("./routers/userRouter");

app.use("/api/v1/users", userRouter);
app.use(catchError);

app.listen(3000,hostname,()=>{
    console.log(`listening on http://${hostname}:${port}`);
})