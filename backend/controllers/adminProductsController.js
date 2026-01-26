import Product from "../models/adminProducts.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ================= ADD PRODUCT ================= */
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 🔹 Upload image buffer to Cloudinary using upload_stream
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const writeStream = cloudinary.uploader.upload_stream(
          { folder: "apni-dukan-products" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(buffer).pipe(writeStream);
      });

    const result = await uploadFromBuffer(req.file.buffer);

    // 🔹 Save product in DB
    const product = await Product.create({
      name,
      price,
      category,
      stock: stock || 1,
      description,
      image: result.secure_url,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      message: "Product added successfully",
       product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, stock, description } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 If a new image was uploaded, stream it to Cloudinary
    if (req.file) {
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const writeStream = cloudinary.uploader.upload_stream(
            { folder: "apni-dukan-products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(buffer).pipe(writeStream);
        });

      const result = await uploadFromBuffer(req.file.buffer);
      product.image = result.secure_url;
    }

    // 🔹 Update fields (agar aaye ho)
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.description = description || product.description;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
