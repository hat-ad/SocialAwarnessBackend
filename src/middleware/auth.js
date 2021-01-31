const { request } = require("http");
const jwt = require("jsonwebtoken");
const MensRanking = require("../models/mens");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "user not logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  const verify = jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    // console.log(payload);
    next();
  });
};
module.exports = auth;
