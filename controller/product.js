const Product = require("../model/product");
const productController = {};

productController.addProduct = async (req, res) => {
  const product = new Product({
    ...req.body,
    addedBy: req.admin._id,
  });
  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
};

productController.getOwnProducts = async (req, res) => {
  try {
    await req.admin.populate("products").execPopulate();
    res.send(req.admin.products);
  } catch (e) {
    res.status(500).send();
  }
};

productController.getAllProducts = async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.category) {
    match.category = req.query.category;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    const products = await Product.find(match)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    res.send(products);
  } catch (e) {
    res.status(500).send();
  }
};

productController.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) res.status(404).send();
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
};

productController.updateProduct = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "description",
    "name",
    "price",
    "discount",
    "category",
    "stock",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid update!" });

  try {
    const product = await Product.findById({ _id: req.params.productId });
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.productId,
      addedBy: req.admin._id,
    });
    if (!product) return res.status(404).json({ message: "No product found" });
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = productController;
