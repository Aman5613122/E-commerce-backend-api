const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const phone_validate = require("validate-phone-number-node-js");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please Enter valid email address");
        }
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
      street: {
        type: String,
        trim: true,
        required: true,
      },
      city: {
        type: String,
        trim: true,
        required: true,
      },
      state: {
        type: String,
        trim: true,
        required: true,
      },
      country: {
        type: String,
        trim: true,
        required: true,
      },
      zip: {
        type: String,
        trim: true,
        required: true,
      },
    },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, trim: true },
        addedToCart: { type: Date },
      },
    ],
    Card_Payment: {
      cardName: { type: String, required: true, trim: true },
      cardNumber: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
          if (!toString(value).length === 16) {
            throw new Error("Card number must be the length of 16");
          }
        },
      },
      expiryDate: {
        type: Date,
        required: true,
        trim: true,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.method.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, "myToken");
  this.tokens = this.tokens.concat({ token });
  await this.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No user found with this email!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password!");

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
