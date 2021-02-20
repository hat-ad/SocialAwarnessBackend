const { request } = require("http");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "user not logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  const verify = jwt.verify(
    token,
    process.env.SECRET_KEY,
    async (err, payload) => {
      // console.log(payload);
      const { _id } = payload;
      // console.log(_id);
      req.user = await User.findById(_id);
      next();
    }
  );
};

const adminAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "admin not logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  const verify = jwt.verify(
    token,
    process.env.SECRET_KEY,
    async (err, payload) => {
      // console.log(payload);
      const { _id } = payload;
      // console.log(_id);
      req.admin = await User.findById(_id);
      next();
    }
  );
};
module.exports = { auth, adminAuth };
