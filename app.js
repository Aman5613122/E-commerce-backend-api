const express = require("express");
require("./server/server");
const app = express();

const userRouter = require("./router/user");
const adminRoute = require("./router/admin");
const productRoute = require("./router/product");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(adminRoute);
app.use(productRoute);

app.listen(3000, () => {
  console.log("server is running");
});
