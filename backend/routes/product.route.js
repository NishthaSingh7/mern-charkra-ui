import express from "express";
import {
  getAllProducts,
  createProduct,
  updatedProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id",updatedProduct);

export default router;