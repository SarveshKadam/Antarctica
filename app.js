const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose'); 
const userRouter = require('./routes/users')
const employeeRouter = require('./routes/employees')
dotenv.config({path : './config.env'});
app.use(express.json())
//MongoDB Setup
mongoose.connect(process.env.DATABASE ,{useUnifiedTopology : true , useNewUrlParser : true,useCreateIndex: true})

const db = mongoose.connection

db.on('error',error => console.error(error))
db.once('open',()=>{console.log('Database is connected')})

app.use(userRouter)
app.use(employeeRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server is listening");
})