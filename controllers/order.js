const { order, ProductCart, Order } = require("../models/order") //in the order model we had exported two things thats why written like this


exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate("products.product", "name price") //when we get an orderById we not only want the order object, we also want the name and price of each product because the order body as a whole will be having many products with diff name and price, so we use the populate method to get name and price from products.product(which simply means for every product in products)
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "No order found in DB"
            })
        }
        req.order = order;
        next;
    })
}

//creating an order , remember there is a reference to user in the orderschema
exports.createOrder = (req, res) => {
    req.body.order.user = req.profile //so in the request body and in that order ... in other words in the request body of order there wwill be a field of user(check order model) and it will be filled from the userId which will be in params and that will trigger the method in user controller and we will get user profile which is written as req.profile there, so basically the user field we are filling with the req.profile which we will be bringing by using getUserById method , we have mentioned it in order.js route also in params section
    const order = new Order(req.body.order) // so creating the order, the order object will be having everything filled in its request body and we are just creating a new object for that which we will get req body and in that order, also think of it like this order is a object of model Order
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error : "failed to save your order in db"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")   //so we want to fill the user(ref) field with values of id and name from user model
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "No orders found in db"
            })
        }
        res.json(order);
    });
};


exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues); //we just send a json response from the enum values which we set in order schema and this is the syntax to do it
}

exports.updateStatus = (req, res) => {
    Order.update(   // we use an update method although it looks like i should use updateOne here as vs code says update is deprecated
        {_id: req.body.orderId},    // we first get the id from req body
        {$set : {status : req.body.status}}, // we set the status whose value we will get from req body
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error : "Status couldn't be updated"
                })
            }
            res.json(order);
        }
    )
}