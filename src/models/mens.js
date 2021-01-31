const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");

//creating schema
// const mensSchema = new mongoose.Schema({
//   ranking: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   country: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   event: {
//     type: String,
//     default: "100m",
//   },
// });

//registration form schema
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: String,
    required: true,
    default: Date.now(),
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//generating token on register
registerSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    // console.log(this.tokens);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    response.send(error);
  }
};

//hashing
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

//creating a collection
// const MensRanking = new mongoose.model("MenRanking", mensSchema);

//register Schema
const Register = new mongoose.model("Register", registerSchema);

// module.exports = MensRanking;
module.exports = Register;
