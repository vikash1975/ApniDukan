import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String, 
      required: true,
    },

    stock: {
      type: Number,
      default: 1,
    },

    description: {
      type: String,
    },

  
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",  
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
