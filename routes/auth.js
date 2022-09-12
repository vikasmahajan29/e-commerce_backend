// instead of doing app.get("/") or app.post(), we instead use router.get() and all that coz we are using express router
// import { router } from "express"; old method, written it here just so u know how import statement works

var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator"); // this check object does all the checking stuff and this validationResult gives the array which gives all the errors
const { signout, signup, signin, isSignedIn } = require("../controllers/auth"); //this is how you require or get the signout method from controller and use it in route here

// const signout = (req,res) => {res.send("you are signed out");} // we usually do this right but in designing apis we use json responses, so lets see how that is done



router.post("/signup",[
    check("name", "name should be atleast 3 character").isLength({ min: 3 }), //in params first is the field which we are checking and other is the custom error message
    check("email", "correct email is required").isEmail(),
    check("password", "password should be atleast 6 char").isLength({ min: 6 })
], signup);

router.post("/signin",[
    check("email", "correct email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 })
], signin);

router.get("/signout", signout) //now we gotta throw them out of here

router.get("/testroute", isSignedIn, (req,res) => { // we are not using next() here because its already done by expressjwt implicitly so no need otherwise you def need next in middleware
    res.send("A protected route")   // so this middleware issignedin will check if the token is there or not and if its not there will say no authorization token
})  // hitesh removed this route idk why if u face error later try removing this

module.exports = router; // all the get post put req associated with router are thrown out