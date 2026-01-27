


 import Product from "../models/adminProducts.js";
export const getFilteredProducts = async (req, res) => {
  try {
    let { category, minPrice, maxPrice, search } = req.query;

    let query = {};

    //  CATEGORY (STRING OR ARRAY BOTH)
    if (category) {
      if (typeof category === "string") {
        category = category.split(",");
      }

      query.category = {
        $in: category.map(
          (c) => new RegExp(`^${c}$`, "i")
        ),
      };
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
    res.status(500).json({ message: error.message });
  }
};
