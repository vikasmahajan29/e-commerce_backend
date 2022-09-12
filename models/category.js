const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:
    {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true 
    }
},
{timestamps : true} //records the exact time when a category will be created
);


module.exports = mongoose.model('Category', categorySchema);