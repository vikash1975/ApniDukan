import Product from "../models/adminProducts.js"

const getAllProduct=async(req,res)=>{
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        console.log("All products fetched:", products.length, "products");
        console.log("Sample product:", products[0]);
        res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching products:", error.message);
     res.status(500).json({message:"server error"})


    }
}

export const getProductById=async(req,res)=>{
    try {
        const {id}=req.params;
        const product = await Product.findById(id);
        
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
     res.status(500).json({message:"server error"})
    }
}

export default getAllProduct;