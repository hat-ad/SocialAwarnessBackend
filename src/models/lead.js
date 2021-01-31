const mongoose = require("mongoose");

//registration form schema
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ph_no: {
    type: Number,
    unique: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdById: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: String,
    required: true,
  },
});

//creating a collection

const Lead = new mongoose.model("Lead", leadSchema);

module.exports = Lead;
