const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ADD PRODUCT
router.post("/", async (req, res) => {

const { name, price, quantity } = req.body;

if (!name) return res.status(400).json({ error: "Name required" });
if (price <= 0) return res.status(400).json({ error: "Price must be positive" });
if (quantity < 0) return res.status(400).json({ error: "Quantity cannot be negative" });

const product = new Product({ name, price, quantity });
await product.save();

res.json(product);

});

// GET ALL PRODUCTS OR LOW STOCK
router.get("/", async (req, res) => {

if (req.query.lowStock === "true") {
const products = await Product.find({ quantity: { $lt: 10 } });
return res.json(products);
}

const products = await Product.find();
res.json(products);

});

// UPDATE QUANTITY
router.put("/:id", async (req, res) => {

const { quantity } = req.body;

if (quantity < 0) return res.status(400).json({ error: "Invalid quantity" });

const product = await Product.findByIdAndUpdate(
req.params.id,
{ quantity },
{ new: true }
);

res.json(product);

});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {

const product = await Product.findByIdAndDelete(req.params.id);

res.json({ message: "Product deleted successfully" });

});

module.exports = router;