const express = require('express')
const mongoose =require('mongoose')
const cors = require("cors");
var app = express()
// app.use(cors());
app.use(cors());

// I ahve import mongoUrl  and I have connect data to live server
const {mongoUrl} = require('./Keys')


// I ahve import userScema to heare
require('./moduls/moduls')
require('./moduls/post')

// meddell level function

app.use(express.json())
app.use(require('./routs/auth'))
app.use(require('./routs/createPost'))

// i have connect database to lveserver
mongoose.connect(mongoUrl)





//  it is for conection end points
mongoose.connection.on("connected",()=>{
	console.log("Your Databse is connected to mongoDB..!")
})

mongoose.connection.on("error",()=>{
	console.log("  Not is connected to mongoDB..!")
})




app.get("/",function(req,res){

	res.send("Welcome");
})




app.listen(5000,function(){
	console.log("Server Started From port at 5000..! ");
})
