const Admin = require("../model/admin");
const adminController = {};

adminController.create = async (req, res) => {
  const admin = new Admin(req.body);
  try {
    await admin.save();
    const token = await admin.generateAuthToken();
    res.status(201).send({ admin, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

adminController.login = async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (e) {
    res.status(400).json({ message: "Admin not found" });
  }
};

adminController.logout = async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.admin.save();
    res.status(200).json({ message: "Admin logout successfully" });
  } catch (e) {
    res.status(500).send();
  }
};

adminController.logoutAll = async (req, res) => {
  try {
    req.admin.tokens = [];
    await req.admin.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

adminController.profile = async (req, res) => {
  res.send(req.admin);
};

adminController.update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "commercialName",
    "mobile",
    "email",
    "banksAccount",
    "password",
    "address",
  ];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid update!" });

  try {
    updates.forEach((update) => (req.admin[update] = req.body[update]));
    await req.admin.save();
    res.send(req.admin);
  } catch (e) {
    res.status(400).send(e);
  }
};

adminController.delete = async (req, res) => {
  try {
    await req.admin.remove();
    res.send(req.admin);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = adminController;
