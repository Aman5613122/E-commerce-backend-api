const mongoose = require("mongoose");
require("dotenv").config();

const db = `mongodb+srv://amankumar:543980002@cluster0.0aalh.mongodb.net/E-commerce?retryWrites=true&w=majority`;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
