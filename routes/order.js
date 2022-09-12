const express = require("express")
const router = express.Router();

const {getUserById, pushOrderInPurchaseList} = require("../controllers/user")
const {isAdmin, isSignedIn, isAuthenticated} = require("../controllers/auth")
const {updateStock} = require("../controllers/product")

const {getOrderById, createOrder, getAllOrders, updateStatus, getOrderStatus} = require("../controllers/order")

//parameter extractor
router.param("userId", getUserById)
router.param("orderId", getOrderById)

//actual routes
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder) // we have given it in this order coz first we check if user is signed in and authenticated then we push his orderInPurchaseList and then we update the stock and then we execute our create order method like this coz we assume that payment has been made and other things have been done and only then we want to create or place the order and only thing left is our backend process of createOrder so that if anything fails we can see what was in purchaselist and check the stock and then work on error of our createOrder

router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders) // so when admin wants to see all the orders he hits this route but we dont want aise hi kisko let them see so using userid we first check if he's admin and all that shit

//status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)    //so we want to update this order's(:orderId) status and it is being done by this user(:userId)

module.exports = router;