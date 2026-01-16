import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { addProduct, deleteProduct, updateProduct } from "../controllers/adminProductsController.js";
import upload from "../middleware/multer.js";

const adminProductRoutes=express.Router();

adminProductRoutes.post("/",adminAuth,upload.single("image"), addProduct);

adminProductRoutes.put("/:id", adminAuth,upload.single("image"), updateProduct);

adminProductRoutes.delete("/:id", adminAuth, deleteProduct);


export default adminProductRoutes;