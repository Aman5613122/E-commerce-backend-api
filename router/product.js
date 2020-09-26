const express = require("express");
const productController = require("../controller/product");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

router.post("/admin/products", adminAuth, productController.addProduct);

router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProduct);
router.get("/admin/products", adminAuth, productController.getOwnProducts);

router.patch(
  "/admin/products/:productId",
  adminAuth,
  productController.updateProduct
);

router.delete(
  "/admin/products/:productId",
  adminAuth,
  productController.deleteProduct
);

module.exports = router;
