var mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, //just tells the db that this value needs to come
        maxlength: 32,
        trim: true // removes whitespaces
    },
    lastname:{
        type: String,
        maxlength: 32,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true //email should be unique
    },
    userinfo:{
        type: String,
        trim: true
    },
    encry_password:{
        type: String,
        required: true

    },
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    purchases:{
        type: Array,
        default: []
    }
}, {timestamps : true}  //records the exact time when a category will be created
);

userSchema.virtual("password")  // passing plain password from encrypassword
    .set(function(password){
        this._password = password  // storing it in _password just in case if needed _ makes _password var private
        this.salt = uuidv1(); // generating salt value
        this.encry_password = this.securePassword(password); //finally encrypting the pass
    })
    .get(function(){
        return this._password //returning plain pass if needed
    })


userSchema.methods = {  // this is .methods because we are defining many methods here

    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password //returns true or false
    },

    securePassword : function(plainpassword){
        if(!plainpassword) return ""; // an empty string received by mongo it understands password isnt valid
        try {
            return crypto
                .createHmac("sha256", this.salt) 
                .update(plainpassword)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema) // this is how you export a schema u have created we can put userSchema instead of user there but for easiness in reference we kept it User
// this line of action is throwing the model out 

