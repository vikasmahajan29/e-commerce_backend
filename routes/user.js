const express = require("express")
const router = express.Router() // this function is used to create router objects ehich will then handle requests

const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

router.param("userId", getUserById) // the implementation here is that whenever ther is ":" colon something it is interpreted as userId and is populated with req.profile from getUserById method which fills req.profile with userObject coming from database

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);  //all the routes associated with userit is simply a route again to get userinfo from userId as param this is that route nothing much basically again like a req for userinfo usingg his id thats why we check first if he issignedin, isauthenticated and then pass the method getuser to get his info which is defined in controller

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser); //we need to see if he is signedin and authenticated before he updates his userinfo

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);  // we're creating this route, at this route we can get the purchaselist of this particular user


module.exports = router;











//router.get("/users", getAllUsers);