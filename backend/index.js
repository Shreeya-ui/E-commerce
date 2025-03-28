const port = 4000;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
const { error, log } = require("console");

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: 'dpvb6vm3r',
  api_key: '477576684453173',
  api_secret: '<your_api_secret>',
  secure: true,
});


const app = express();

app.use(express.json());
app.use(cors());

// ✅ Database Connection with Error Handling
mongoose.connect(
    "mongodb+srv://shreeyabkumbhar:IdbN6X52IMrw2j9E@cluster0.c000o.mongodb.net/e-commerce",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
db.once("open", () => console.log("✅ MongoDB Connected Successfully"));

// ✅ API Home Route
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// ✅ Image Storage Configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `product_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// ✅ Serving Uploaded Images
app.use('/images', express.static('upload/images'));

// ✅ Image Upload Endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// ✅ Product Schema
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

// ✅ Add Product Endpoint
app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price
        });

        await product.save();
        console.log("✅ Product Saved:", product);

        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("❌ Error Adding Product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Remove Product Endpoint
app.post("/removeproduct", async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        console.log("✅ Removed Product:", deletedProduct);
        res.json({ success: true, message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        console.error("❌ Error Deleting Product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// ✅ Get All Products Endpoint
app.get("/allproducts", async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("✅ All Products Fetched");
        res.send(products);
    } catch (error) {
        console.error("❌ Error Fetching Products:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//schema creating for users model

const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//creating endpoint for registring the user
app.post('/signup',async(req,res)=>{

    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"existing user found with same email address"});
    }
    let cart={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

//creating endpoint for userlogin

app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare =req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecomm');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Wrong Emailid"});
    }
})
//creating endpoint for new collection data
app.get('./newcollection',async (req,res)=>{
    let products=await Product.find({});
    let newcollection=product.slice(1).slice(-8);
    console.log("New Collection fetched");
    res.send(newcollection);
    

})
app.get('./popularinwomen',async (req,res)=>{
    let products =await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
    
})

//creating  middelware to fetch user

const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try {
            const data=jwt.verify(token,'secret_ecomm');
            req.user=data.user;
            next();
            
        } catch (error) {
            res.status(401).send({errors:"please authenticate using valid token"})
        }
    }
}

//creating api to save product in cart
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure the item exists in the cart before updating
        if (userData.cartData.hasOwnProperty(req.body.itemId)) {
            userData.cartData[req.body.itemId] += 1;
        } else {
            userData.cartData[req.body.itemId] = 1; // Initialize item if not present
        }

        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData },
            { new: true }
        );

        res.json({ success: true, message: "Added to cart successfully", cartData: userData.cartData });
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//creating end point to remove product from vart data
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the product exists in the cart
        if (userData.cartData[req.body.itemId] && userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1; // Reduce quantity by 1
            if (userData.cartData[req.body.itemId] === 0) {
                delete userData.cartData[req.body.itemId]; // Remove item if quantity is 0
            }
        } else {
            return res.status(400).json({ success: false, message: "Item not in cart" });
        }

        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData },
            { new: true }
        );

        res.json({ success: true, message: "Removed from cart successfully", cartData: userData.cartData });
    } catch (error) {
        console.error("❌ Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//creating endpoint to get cartdata

app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("get Cart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
    
    
})

// ✅ Start Server
app.listen(port, (error) => {
    if (!error) {
        console.log(`🚀 Server running on port ${port}`);
    } else {
        console.log("❌ Server Error:", error);
    }
});
