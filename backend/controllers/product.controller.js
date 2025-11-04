// backend/controllers/product.controller.js
import Product from "../models/product.model.js";
import mongoose from "mongoose";

/**
 * categoryKeywords: synonym map (lowercase)
 */
const categoryKeywords = {
  fitness: ["gym", "fitness", "workout", "yoga", "training", "exercise"],
  electronics: ["electronics", "tv", "laptop", "camera", "speaker"],
  gadgets: ["gadget", "charger", "earbuds", "powerbank"],
  clothing: ["clothing", "shirt", "jeans", "dress", "apparel"],
  footwear: ["shoe", "shoes", "footwear", "sneaker", "boots"],
  accessories: ["accessory", "accessories", "belt", "watch", "bag"],
  beauty: ["beauty", "makeup", "skincare", "cosmetics"],
  home: ["home", "kitchen", "cookware", "appliance", "decor"],
  books: ["book", "novel", "literature", "paperback"],
  toys: ["toy", "toys", "game", "puzzle"],
  groceries: ["grocery", "groceries", "food", "snack"],
  stationery: ["stationery", "notebook", "pen", "office"],
  pets: ["pet", "pets", "dog", "cat", "pet-food"],
  automotive: ["auto", "automotive", "car", "vehicle"],
};

/**
 * GET /api/products
 * Supports ?search= & ?category=
 */
// replace only the getAllProducts function with this// Replace only the getAllProducts function with this robust in-memory filter
export const getAllProducts = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    // normalize helpers
    const norm = (s = "") => String(s || "").toLowerCase().trim();
    const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // build tokens from category and search
    const categoryRaw = norm(category);
    const searchRaw = norm(search);

    const tokens = [];
    if (categoryRaw) tokens.push(...categoryRaw.split(/[\s&,_-]+/).filter(Boolean));
    if (searchRaw) tokens.push(...searchRaw.split(/[\s&,_-]+/).filter(Boolean));

    // build pattern set: tokens + synonyms keys + synonyms
    const patternSet = new Set();
    tokens.forEach((t) => patternSet.add(t));

    // expand with synonyms (categoryKeywords must be defined above in the file)
    for (const token of Array.from(patternSet)) {
      for (const [key, kws] of Object.entries(categoryKeywords)) {
        if (key === token || kws.includes(token)) {
          patternSet.add(key);
          kws.forEach((k) => patternSet.add(k));
        }
      }
    }

    const patterns = Array.from(patternSet).filter(Boolean);
    const patternRegexes = patterns.map((p) => new RegExp(escapeRegex(p), "i"));

    // DEBUG: log what we're matching
    console.log("=== getAllProducts (IN-MEMORY FILTER) ===");
    console.log("req.query:", req.query);
    console.log("derived patterns:", patterns);

    // fetch all products (or you can limit if huge)
    const allProducts = await Product.find({}).lean();
    console.log("total products fetched from DB:", allProducts.length);

    // filter in memory:
    let filtered = allProducts.filter((p) => {
      const name = norm(p.name);
      const desc = norm(p.description);
      const cat = norm(p.category);

      // If user provided category -> require category match (via patterns) OR name/desc match
      if (categoryRaw) {
        // match any pattern in category OR name OR description
        return patternRegexes.some((rx) => rx.test(cat) || rx.test(name) || rx.test(desc));
      }

      // No category provided: if search provided -> match name/desc by search
      if (searchRaw) {
        const srx = new RegExp(escapeRegex(searchRaw), "i");
        return srx.test(name) || srx.test(desc);
      }

      // no filters -> include all
      return true;
    });

    console.log("matched products count after in-memory filter:", filtered.length);

    // return the filtered list
    return res.status(200).json({ success: true, data: filtered });
  } catch (err) {
    console.error("GET /api/products error (in-memory approach):", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



/**
 * POST /api/products — create new product
 */
export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!product.name || !product.price || !product.image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details",
      });
    }
    const newProduct = await Product.create(product);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * PUT /api/products/:id — update product
 */
export const updatedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid product id" });
    }

    const updated = await Product.findByIdAndUpdate(id, product, { new: true });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * DELETE /api/products/:id — delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
