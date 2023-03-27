const mongoose = require("mongoose");

const userS = mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    pass:{
        type:String,
        required:true,
    },

},{versionKey:false});

const userModel = mongoose.model("user",userS);

module.exports ={
    userModel
}