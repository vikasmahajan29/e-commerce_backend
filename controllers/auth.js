const User = require("../models/user");
const {  validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res) => {

    const errors = validationResult(req);    // the validation result's error messages will be populated into this const errors the req body will be checked which is passed as parameter

    if(!errors.isEmpty()){
        
        return res.status(422).json({
            error : errors.array()[0].msg
        });
    }
    const user = new User(req.body) // creating obj of class User model and inheriting the fields and populating them using method req.body
    user.save((err, user) => {  //.save() has two params or give two objs/properties back one is err and other is the obj itself
        if(err){    // so if there was an error
        
            return res.status(400).json({   // return a response of status code 400(bad request) and then return a json response also because in the frontend if these json message are parsed nicely then it would be easy for frontend engineer to craft an error message more particularly 
                err: "Not able to save user in DB"  // throw an error object with this message
            })
        }
        //  res.json(user); // if there's no error we will return entire user 
        res.json({
            name: user.name,
            email: user.email,
            id : user._id
        });
        
    });
};  // now we could just do user.save() but we wanted to see if it really got saved and if not return the error


exports.signin = (req,res) => {
    const errors = validationResult(req);
    const {email, password} = req.body; // getting the email and pass fields from the req body, this is called destructuring, also remember we had made a major error here this we were getting error called reference to req body is not defined that was because we had written this outside the signin controller lol, now we have placeed it inside and has refernce to req is clear
    
    if(!errors.isEmpty()){
        
        return res.status(422).json({
            error : errors.array()[0].msg
        });
    }

    User.findOne({email}, (err,user) => { //finds the match for given email and returns either err or the user found
        if(err || !user) // there was an error here actually like first in the if condition we had kept just the err part but with that we were not getting any response in postman so what we did was however we wouldnt find the user in db na so we placed err || !user like if user not found then return this error message
        {
            return res.status(400).json({
                error: "USER email doesnot exist"
            })
        }

        if(!user.authenticate(password)){       // using authenticate method from User model
            return res.status(401).json({
                    error: "Email and password donot match"
                })
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET) //so creating a token, use the jwt method called sign which takes two param one is the field using which you want to create token and we have used _id field for that which we will get from the user object and the other param is like just a random string with which u want to create token so we could have mentioned that there itself like for ex"shhh" shown in docs but for security purpose we created env var and used that here
        res.cookie("token", token, {expire: new Date() + 9999}) // putting token in cookie we directly use this .cookie method which takes token and name it as token and third param is mentioning the expiry date 

        //sending response to front end now
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}}) // we wanna send the token so the frontend app can store it in the local storage and the user info which can be stored in the user object which we have destructured in the above line
    
    })
}


exports.signout = (req,res) => {    // writing the method and exporting it on go since there will be many methods here we are using this approach
   
    res.clearCookie("token"); //claerCookie method comes from the middleware cookieparser, we just need to pass the cookie which is named as token here which we created when user signs in , we just have to clear the cookie in signout

    res.json({
        message: "user signed out"
    });
    
};


//protected routes  
// what we're doing here basically is using expressJwt to check if user is signed in by creatng this middleware it'll simply check if the auth token is there or not , so in postmanif see when you use bearer and send that token the test is passed like we are allowd inside
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET, //this method expressJwt needs you to pass a secret key
    userProperty: "auth"    //this is a method idk we're using from cookieparser so we can name it anything it is like var which we can use it again with res.json(auth) to get userproperties when he issignedin
}); 

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id; // we are creating a var checker which will be filled with true or false based on if the statement holds true
    // req.profile will be set by frontend where this profile will be filled with details enetered like email role id, req.auth will be filled with the userProperty created in above issignedin method then req.profile._id we take id from profile and check if it matches with id taken from req.auth._id 
    if(!checker){
        return res.status(403).json({   //403 means not allowed to do so
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res, next) => {
    if(req.profile.role === 0) // again we take this role detail from profile which will be set up by frontend
    {
        return res.status(403).json({
            error: "You are not an ADMIN, access denied"
        })
    }
    next();
}




















// exports.signup = (req, res) => {
//     console.log("REQ BODY", req.body); // using the body parser middleware to get the info from req body and print it on terminal
//     res.json({
//         message: "signup route works"
//     });
// }; // this was to check or get the info from req body onto the console that's it