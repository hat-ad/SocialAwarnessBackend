const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");

//registration form schema
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  comapany_name: {
    type: String,
    unique: true,
  },
  ph_no: {
    type: Number,
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
});

//generating token on register
companySchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    return token;
  } catch (error) {
    response.send(error);
  }
};

//hashing
companySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

//creating a collection

const Company = new mongoose.model("Company", companySchema);

module.exports = Company;
