require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("../src/db/connection.js");

const authRouter = require("./routers/auth.js");
const postsRouter = require("./routers/posts.js");

require("./db/connection.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(postsRouter);
app.use(express.static(__dirname));
app.use(express.static("public"));
app.listen(port, () => {
  console.log(`connection is live at ${port}`);
});
