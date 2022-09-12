const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product: {  //we are however selecting the products created so getting this info from there
        type: ObjectId,
        ref: "Product"
    },
    name: String, // name of product
    count: Number, // total items
    price: Number // total amount
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema); //creating model then throwing it as export

const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema], //we'll create this, its an array of all the products in cart aisa kuch
    transaction_id: {},
    amount: {type: Number},
    address: String,
    status : {
        type : String,
        default : "Received",   //for the order status we want to use a fixed amount of terms, so we create an enum which is nothing but an array of strings only which will be used for this KEY status here
        enum : ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
    },
    updated: Date, // so that admin can give info like ordered at etc
    user:{  // to know which user has placed order
        type: ObjectId,
        ref: "User" // the ref option here tells us what model to use during population which is user here
    }
},
{timestamps: true}
);

const Order = mongoose.model("Order", OrderSchema); //creating model then throwing it as export

module.exports = {Order, ProductCart};
