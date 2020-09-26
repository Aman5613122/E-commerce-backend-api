const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Product = require("./product");
const phone_validate = require("validate-phone-number-node-js");

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    commercialName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Provide a valid email!");
      },
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!phone_validate.validate(value)) {
          throw new Error("Please Enter valid phone number");
        }
      },
    },
    address: {
      street: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      country: { type: String, trim: true, required: true },
      zip: { type: String, trim: true, required: true },
    },
    bankAccount: {
      bankName: { type: String, required: true, trim: true },
      bankAddress: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        zip: { type: String, required: true, trim: true },
      },
      accountNumber: { type: Number, required: true, trim: true },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Provide a strong password!");
      },
    },
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "addedBy",
});

adminSchema.methods.toJSON = function () {
  const adminObj = this.toObject();
  delete adminObj.password;
  return adminObj;
};

adminSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "myToken");
  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Provider.findOne({ email });
  if (!admin) throw new Error("No provider found with this email!");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Incorrect password!");

  return admin;
};

adminSchema.pre("save", async function (next) {
  const admin = this;

  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }

  next();
});

adminSchema.pre("delete", async function (next) {
  await Product.deleteMany({ addedBy: this._id });

  next();
});

const Provider = mongoose.model("Admin", adminSchema);

module.exports = Provider;
