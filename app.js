require("dotenv").config();

const express=require("express");
const path=require("path");
const userRouter=require("./routes/user");
const blogRouter=require("./routes/blog");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const Blog=require('./models/blog');




const app=express();
const PORT=process.env.PORT || 8000;

mongoose.connect( process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));
app.use(express.static('public'));

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
})

app.use('/user',userRouter);
app.use('/blog',blogRouter);

app.listen(PORT,()=>console.log(`server starte at PORT:${PORT}`));