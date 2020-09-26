const express = require("express");
const userAuth = require("../middleware/userAuth");
const userController = require("../controller/user");
const userPayment = require("../controller/payment");
const router = express.Router();

router.post("/users", userController.create);
router.post("/users/login", userController.login);
router.post("/users/logout", userAuth, userController.logout);
router.post("/users/logoutAll", userAuth, userController.logoutAll);
router.post(
  "/users/cart/:productId",
  userAuth,
  userController.addProductToCart
);
router.post("/users/payment", userAuth, userPayment.paid);

router.get("/users/me", userAuth, userController.profile);
router.get("/users/cart", userAuth, userController.getCartProducts);

router.patch("/users/me", userAuth, userController.update);

router.delete("/users/cart/removeAll", userAuth, userController.emptyCart);
router.delete(
  "/users/cart/:productId",
  userAuth,
  userController.removeProductFromCart
);
router.delete("/users/me", userAuth, userController.delete);

module.exports = router;
