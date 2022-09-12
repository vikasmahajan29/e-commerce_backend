const Category = require("../models/category") // so we're bringing this to fill our res.json file and thats it like we did in req.profile filled res.json with user


exports.getCategoryById = (req, res, next, id) => {
    //extracting the id is done by this findById method all credit to mongoose man
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "category not found in db"
            })
        }
        req.category = cate;    //so if no err is there, it means we have received a response in the form of cate(which is nothing but the category itself chup short me bolke we named it like that) and we want to populate a request object called category so req.category and fill it with the cate
        next();
    })
    
}


exports.createCategory = (req, res) => {
    const category = new Category(req.body) // we have created a model and exportd it as Category in models, so we are creating a new object of that model called category and it will be populated with the request body, the request body will be holding everything that the Category schema requires it to 
    category.save((err, category) => {  // saving the category object in db
        if(err){
            return res.status(400).json({
                error: "NOT able to save category in DB"
            })
        }
        res.json({category}); // if no eror send a json response of category object
    })
}

exports.getCategory = (req,res) => {
    return res.json(req.category); // just like that getUser method

}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err, categories) => {  // just find method without providing id or anything gets everything and we can chain it to an exec method
        if(err){
            return res.status(400).json({
                error: "NO categories found"
            })
        }

        res.json(categories);
    })           
}

exports.updateCategory = (req, res) => {
    const category = req.category;      // this req.category we are able to grab coz of that parameter :categoryId whichfires up getCategoryById and req.category will be filled by that cate
    category.name = req.body.name;  // then update the category name by taking the name from the req body

    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "failed to update category"
            })
        }
        category.createdAt = undefined; // nothing man just tried that shit if we could hide some response part in postman yk just like we did with users
        res.json(updatedCategory);
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;  // this again from the middleware extracting things from the parameter
    const value = category.name;
    category.remove((err, category) => {    // remove op is give by mongoose
        if(err){
            return res.status(400).json({
                error: "failed to delete category"
            })
        }
        res.json({
            message : `successfully deleted ${value} `  // did this to show what has been deleted
        })
    })   
}