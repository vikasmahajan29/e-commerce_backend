const User = require("../models/user"); // getting user model
const Order = require("../models/order");



exports.getUserById = (req, res, next, id) => { //this fourth param id acts as the parameter
    User.findById(id).exec((err, user) => { //findById is also mongoose method just like findOne we bind it with this exec method so it is executed and like previously said mongoose mthods either return err or user object
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = user; // if user was found we make an object inside req body, call it profile and fill it with user
        next();
    })
}


exports.getUser = (req,res) => {

    req.profile.salt = undefined; // or you could pass an empty string, we do this to hide sensitive info from browser which we we are getting into the req.profile body
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate( // couple of paramters to be passed on
        {_id : req.profile._id}, // so how this is coming is, if you check our route is on /:userId which fires that middleware router.param("userId") and because of which req.profile will be populated
        {$set : req.body}, // this line means we want to set values in req body
        {new : true, useFindAndModify: false}, // new true coz updation is happening and other on coz as shown in docs
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "you are not allowed to update user info"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res) => {   // we are pulling info from order model
    Order.find({user: req.profile._id})    // pulling orders from the orders pushed by a particular id
    .populate("user", "_id name")   // "user" model u wanna reffer and "_id, name" values u wanna bring in. // we are filling the user field in order.js schema with populate method , filling it with values of id and name
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: "No orders in this account"
            })
        }
        return res.json(order);
    })  //read from notebook also
}   // so this method first uses find method on order collection there we have given a ref to user so we find user with reqprofileid then populate user with  id and name using populate method the method allows us to reference other collection(user)
//next we will be returned either err or order completely like the order object will be having all the info defined in its schema in order.js collection


exports.pushOrderInPurchaseList = (req, res, next) => {  // its an array of objects
    
    let purchases = []; // we are gonna pass info into this array from user's req body
    req.body.order.products.forEach(product => {    //we are gonna call it from frontend, we are taking this products which itself will be an array u can check orderschema in order.js and we will loop through each and pick info and put it into an object and then push that object in purchases array

        purchases.push({    // pushing object into array
            _id: product._id,   // id of the product
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount : req.body.order.amount, // amount we will be receiving from order from req body
            transaction_id: req.body.order.transaction_id
        })
        
    });

    //store this in db
    User.findOneAndUpdate(  // using findOneAndUpdate method coz by default the array is empty but from the next time it'd be filled so just update
        {_id: req.profile._id}, // how are we gonna find? by passing _id which will be filled by this req.profile._id method we have defined
        {$push: {purchases: purchases}},    // next we dont wanna set but push instead because its an array and we wanna push this our above defined local purchases array into the purchases array in the user model
        {new: true},    // this tells the db to give me the updated list and not the old one because update is happening and its true
        (err, purchases) => {   // we either get the err or purchases array 
            if(err){
                return res.status(400).json({
                    error: "unable to save purchase list"
                })
            }   // we havent done res.json(purchases) here coz this middleware is just updating and we dont really need that back as the response however if theres no error message its understoodd that response has been made
        }
    )

    // basically we are getting some info from frontend, looping through it , creating an object from it, storing that object by pushing into array and finally using this below method to update purchases array
    next();
}





















// exports.getAllUsers = (req,res) => {
//     User.find().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error: "NO users"
//             })
//         }
//         req.profile = users;
//         return res.json(req.profile);
//         // or just res.json(users) would have also worked
//     })
// }