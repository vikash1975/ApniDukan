import express from "express";
import getAllProduct, { getProductById } from "../controllers/productController.js";

const productRoutes=express.Router();

productRoutes.get("/", getAllProduct);
productRoutes.get("/:id", getProductById);

export default productRoutes;