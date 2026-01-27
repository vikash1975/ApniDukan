


import Product from "../models/adminProducts.js";

export const getFilteredProducts = async (req, res) => {
  try {
    let { category, minPrice, maxPrice, search } = req.query;

    console.log("RAW query:", req.query);

    let query = {};

    //  CATEGORY FIX
  if (category && category.length > 0) {
  query.category = { $in: category };
}


    //  PRICE
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    //  SEARCH
    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    console.log("FINAL QUERY:", query);

    const products = await Product.find(query);
    res.status(200).json(products);

  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ message: error.message });
  }
};
