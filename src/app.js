require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("../src/db/connection.js");
const fileUpload = require("express-fileupload");

const authRouter = require("./routers/auth.js");
const postsRouter = require("./routers/posts.js");

require("./db/connection.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(fileUpload());
app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // res.append("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type,Accept"
//   );
//   next();
// });
app.use(cors());
app.use(authRouter);
app.use(postsRouter);
app.use(express.static(__dirname));
app.use(express.static("public"));
app.listen(port, () => {
  console.log(`connection is live at ${port}`);
});
