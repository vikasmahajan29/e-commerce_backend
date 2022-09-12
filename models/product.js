const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema; // pulling the objectId data type from mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    price:{
        type: Number,
        required: true,
        maxlength: 32,
        trim: true 
    },
    category:{
        type: ObjectId,
        ref: "Category",  //we have to give a reference like from where we are getting this , we have exported category in category.js
        require: true
    },
    stock:{
        type: Number
    },
    sold:{
        type: Number,
        default: 0
    },
    photo:{
        data: Buffer,
        contentType: String
    },  // other way of storing photos so DB doesn't get heavier is to store them in s3 bucket in amazon and pull then using address or a reference
    size:{
        type: String
    }
},
{timestamps: true});

module.exports = mongoose.model("Product", productSchema);