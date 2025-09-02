const app = require("./app.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

mongoose
  .connect("mongodb://127.0.0.1:27017/LearnLoop")
  .then(() => {
    console.log("Connected To DB Successfully");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}}`);
});
