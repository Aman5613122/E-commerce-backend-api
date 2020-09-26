const mongoose = require("mongoose");
const validator = require("validator");
const phone_validate = require("validate-phone-number-node-js");

const paymentSchema = mongoose.Schema(
  {
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!phone_validate.validate(value)) {
          throw new Error("Please Enter valid phone number");
        }
      },
    },
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
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
