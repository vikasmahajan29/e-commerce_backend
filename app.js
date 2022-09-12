require("dotenv").config(); // this is how you require this, its an old method in node. This statement here means that we want to load the .env file and use any var inside that file

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//my routes
const authRoutes = require("./routes/auth") // and here we get the thrown routes all in one, here since this module is created by us we need to mention the complete path in require statement, the path is like from the current dir go to routes and then auth file
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")




//myfun.run().then().catch() this is how we do it in js after the run method is succesful then the then() method is run and if something is wrong the catch() method is executed
// similar to that we create our mongodb connection function
//mongoose.connect("mongodb://localhost:27017/tshirt", { // this string is what connects db to app, lets call our db name as tshirt, the url is path to db which is by deafult running locally on port number 27017

//DB CONNECTION
mongoose.connect(process.env.DATABASE, {        // process is the thing wherre it attaches from the .env file. This way we dont have to expose the url string which is a sensitive information
    useNewUrlParser: true,                      // old url parser is deprecated so this is to ensure that youre using newUrlParser , old method of mentioning url is deprecated
    useUnifiedTopology: true,                   // DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
    useCreateIndex: true                        //Again previously MongoDB used an ensureIndex function call to ensure that Indexes exist and, if they didn't, to create one. This too was deprecated in favour of createIndex. the useCreateIndex option ensures that you are using the new function calls.
                                                // these parameters just basically help in keeping our databse connection alive
}).then(() => {
    console.log("DB CONNECTED");                // this is a callback when app connects to db
});

//MY MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors() );

//MY ROUTES or more like designing apis
app.use("/api", authRoutes);    // we create a middleware first ,for all the routes coming from authRoutes, so prefix api is to be used coz of syntax so we know that its an api and all the routes will be coming from this authRoutes which we will define in routes
app.use("/api", userRoutes);    // again a middleware to handle userroutes
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);



//const port = 8000;
const port = process.env.PORT || 8000;


//STARTING SERVER
app.listen(port, () => {
    console.log(`app is running at ${port}`); // this is just another of writing in the log statement u could follow the usual method also of using ""

});







// to run this just do npm start as it has been mentioned in the package.json file
