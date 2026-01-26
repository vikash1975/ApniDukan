import Product from "../models/adminProducts.js";

/* ================= GET ALL PRODUCTS ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("Get product by id error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PRODUCTS (DEFAULT EXPORT) ================= */
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log("Get all products error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default getAllProduct;
