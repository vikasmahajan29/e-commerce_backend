const express = require("express");
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")    // we have required this method coz remember? when it sees an id(paramter) in the route or url it fires up and fills the req.profile with user body(info) this is basically a parameter extraction

//params
router.param("userId", getUserById) //this line is to use the getUserById method , whenever it sees userid in parameter it fires and populates user field
router.param("categoryId", getCategoryById) // so this is how u use params, this line is again built to extract categoryId and then fire the getCategoryById method

//actual route goes here
router.post("/category/create/:userId",isSignedIn, isAuthenticated, isAdmin, createCategory)     // we need to validate user so using this userId param
router.get("/category/:categoryId", getCategory)    // this route gets a category when it sees that parameter(:), the router.param will fire getCategoryById  and fill the req body
router.get("/categories", getAllCategory)   //this get req is to get all categories
router.put("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, updateCategory)    // this req is to update a category
router.delete("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, removeCategory) // this req is to delete a category

module.exports = router;