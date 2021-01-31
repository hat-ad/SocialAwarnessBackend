const mongoose = require("mongoose");

const connection = mongoose
  .connect(process.env.DB_NAME, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connection is sucessfull");
  })
  .catch((e) => {
    console.log("no connection");
  });

module.exports = connection;
