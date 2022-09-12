const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash") // this is how you require something if u wanna use it just as a private var
const fs = require("fs")    // we need to access the filepath also right for the images and videos so we need to have a file system(fs) which we require from the buikt in node module called fs


exports.getProductById = (req, res, next, id) => {
    Product.findById(id)    // we can bind as many methods we want
    .populate("category")   // u can avoid this line, we do this to fill up the category field in product model and if u check model we have used ref to category and this is how populate method works
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error : "Product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => { // this method is gonna make use of forms

    let form = new formidable.IncomingForm();  // first step is creation of form using this IncomingForm method
    form.keepExtensions = true;     // this saying true here means we need to show(say) the extensions of file
    // parsing the form has 3 parameters , err, fields(name,etc) and then the files
    form.parse(req, (err, fields, file) => {    // //Parses an incoming Node.js request containing form data. If callback is provided, all fields and files are collected and passed to the callback.
        if(err){
            return res.status(400).json({
                error : "problem with image"    // the fields error messages can be handled before submitting the request only iykyk
            })
        }
        // destructuring the fields , so we dont have to do fields.this and fields.that we can directly use the fields name by themselves
        const {name, description, price, category, stock} = fields; //so we are saying all these are coming from fields and we'll directly use these names

        if( //adding restrictions to the fields but the restriction or validation we did in  auth using check method of express validator on the route itself to check some things is a better method these days
            !name ||
            !description ||
            !price ||
            !category ||
            !stock 
        ){
            return res.status(400).json({
                error : "Please include all fields"
            });
        }
        
        let product = new Product(fields) // we are creating a new product with this line using the Product model, filling up all the fields with the fields values coming from form data

        if(file.photo){
            if(file.photo.size > 3000000){  // 2mb in bytes almmost 2*1024*1024 .... using the property size
                return res.stauts(400).json({
                    error : "file size too big, keep it smaller than 2mb"
                })

            }   // now if there's no problem with file size we simply include the product
            product.photo.data = fs.readFileSync(file.photo.path)   // now here we mention the path of photo(file) we fill value of prodduct.photo.data with the photo path using fs and its inbuilt method readFileSYnc which takes the path property , its done using formidable which parses the form and goes to file(we mentioned it in 3 params in form.parse) and then gets the path property of that photo
            product.photo.contentType = file.photo.type // now getting the contentType using the type property of photo or file u can say
            // we basically are filling up the data and contentType field values in our product model
        }
        // now saving photo to db
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error : "Saving tshirt in db failed"
                })
            }
            res.json(product)   // if no problem then its saved and we receive the product back as a json response
        })
        console.log(product);   // this line of debug code led us to realise that category in product model is a ref to category of other model so we cant just directly pass the value, sice its data type is object id we neeed to pass the id of category from db as value
    })     
}


exports.getProduct = (req, res) => {
    req.product.photo = undefined; // we do this coz binary data is bulky and it can slow down the response of get req
    return res.json(req.product)    // this is easily done because req.product is filled by our getPoductById...now the json data is parsed quickly

}

exports.photo = (req, res, next) => {   // so we create a middleware that will handle binary data so it gets loaded in the backend while our above json data is parsed and this makes our app faster
    if(req.product.photo.data){ // we do this only if the photo is present in the req.product
        res.set("Content-Type", req.product.photo.contentType)  // we set a key called contentType whose value will be the contentType which we get from the photo itself
        return res.send(req.product.photo.data) // and then we send back the data of photo yaani the photo itself as a response
    }
    next();
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {// again either err or an object of delted product is returned
        if(err){
            return res.status(400).json({
                error : "Failed to delete the product"
            })
        }
        res.json({
            message : "Product deleted",
            deletedProduct  // u can delte this line if u want
        })
    })
}

exports.updateProduct = (req, res) => { // copying code from createProduct

    let form = new formidable.IncomingForm();  
    form.keepExtensions = true;     

    form.parse(req, (err, fields, file) => {    
        if(err){
            return res.status(400).json({
                error : "problem with image"    
            })
        }

        // const {name, description, price, category, stock} = fields; 

        // if( 
        //     !name ||
        //     !description ||
        //     !price ||                // commented out this coz we dont necessarily need him to fill all the fields here
        //     !category ||
        //     !stock 
        // ){
        //     return res.status(400).json({
        //         error : "Please include all fields"
        //     });
        // }
        
    //    let product = new Product(fields)   // we already have the product , so 

        let product = req.product   // we get it like usual with productId, as soon as route sees a parmater(productId), the associated param method will fire and give us the product which if u check method is found using findById method    
        product = _.extend(product, fields) // we want to update the product object with values of fields(new ones given in the form from update UI page),

        if(file.photo){
            if(file.photo.size > 3000000){ 
                return res.stauts(400).json({
                    error : "file size too big, keep it smaller than 2mb"
                })

            }   
            product.photo.data = fs.readFileSync(file.photo.path)   
            product.photo.contentType = file.photo.type 
        }

        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error : "updation of product failed"
                })
            }
            res.json(product)  // if updated we are just getting the product back which we show to user or ourselves for testing purpose
        })
    })    
    
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ?  parseInt(req.query.limit) : 8    // so we are giving user a feature to choose how many products he wishes to see on home page , now if he fills that parameter a query will be fired up and it will be taken from req body using the query parameter and its value will be stored in limit var, we are using ternary operator ans so if he doesnt we use a default value of 8 but when a parameter or value is handled from url it is treated as string so we use parseInt method to convert it to int
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" // so if query of how u want the items to be sorted is given its taken from req body using the query method or else it'll be by default sorted using id

    Product.find()  // remember when we dont pass any condition and just hit find on db it gives back everything
    .select("-photo") // the photos slow down the loading process so we use this method which is actually to select what u want but we just dont want photos here so we use that minus sign
    .populate("category") //since we want the category also to be shown
    .sort([[sortBy, "asc"]]) //sort the products  based on like creation date or whose more items sold ... syntax is weird, u could also have it like .sort([['updatedAt, descending]])
    .limit(limit)
    .exec((err, products) => {  // so we just bind an execution method to it which either returns err or all the products
        if(err)
        {
            return res.status(400).json({
                error : " No products found"
            })
        }
        res.json(products)
    })
}

exports.updateStock = (req, res, next) => { // this is a middleware, ...  took it from mongoose docs these methods

    let myOperations = req.body.order.products.map(prod => {    //the req body has order which will have multiple products and using map we are looping through each product and and for every product we perform(return, use this method updateOne from docs) first we find the id of prod using filter and then update inventory by performing update where we are giving an increment operation and stock will be -prod.count and sold will be +...this count we will be getting from frontend like how many items in his cart based on that
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {    // so this mongoose method has 3 params and allows us to perform multiple ops on our DB in a single round, the first param is all the ops u wanna perform second is options which we dont have so left empty and third is the callback which either gives the err or resultofOperations which will be products itself here
        if(err){
            return res.status(400).json({
                error : "Bulk operations failed"
            })
        }
        next()
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {   //this distinct method gives all the unique values of a field, takes 3 params, first the field, second options if any, third the calback
        if(err){
            return res.status(400).json({
                error : "No categories found"
            })
        }
        res.json(category)
    })
}                                                   