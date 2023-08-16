
const mongoose = require('mongoose')

const  userScema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Photo:{
        type:String,
        
    }


})
// I have wrap all scema
 mongoose.model("USER",userScema)