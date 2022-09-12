const express = require("express")
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product")
const {getUserById} = require("../controllers/user")
const {isAdmin, isSignedIn, isAuthenticated} = require("../controllers/auth")


router.param("userId", getUserById) //handling the userId parameter using getUserById
router.param("productId", getProductById)   // handling productId parameter....these parameters are always passed in url and are handled using router.param


router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct )
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)  // this is just for performance optimisation, you can just avoid it by removing req.product.photo undefined in controller

router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)   //deleting a product given its id by the admin only
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)  //updating a product using put method

router.get("/products", getAllProducts) // this is a listing route when a user just wants to see the products like home page bro so no need of those middlewares
router.get("/products/categories", getAllUniqueCategories)  //this should be giving us all the categories so its helpful when creating product

module.exports = router;