require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
// Rate Limiting
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100 // max 100 requests per IP
});

app.use(limiter);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


app.use("/products", productRoutes);

const PORT = 5000;

app.listen(PORT, ()=>{
console.log("Server running on port " + PORT);
});
