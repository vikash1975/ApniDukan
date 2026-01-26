import Product from "../models/adminProducts.js";

export const getFilteredProducts = async (req, res) => {
  try {
    // Trim query params to remove extra spaces/newlines
    let category = req.query.category ? req.query.category.trim() : undefined;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let search = req.query.search ? req.query.search.trim() : undefined;

    console.log("Filter params received:", { category, minPrice, maxPrice, search });

    let query = {};

    if (category) {
  if (Array.isArray(category)) {
    query.category = { $in: category };
  } else {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }
}


    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
      console.log("Price filter applied:", query.price);
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
      console.log("Search filter applied:", query.name);
    }

    console.log("Final MongoDB query:", query);

    const products = await Product.find(query);
    console.log("Products found:", products.length);
    
    res.status(200).json(products);

  } catch (error) {
    console.error('Filter error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
