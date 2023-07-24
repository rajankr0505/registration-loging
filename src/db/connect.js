const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/loginRegiration", {
    useNewUrlParser: true,
    // useUnifiedToplogy: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err);
  });
