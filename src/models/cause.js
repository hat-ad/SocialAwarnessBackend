const mongoose = require("mongoose");

//cause schema
const causeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdByID: {
    type: String,
    required: true,
  },

  appreciateBy: [
    {
      name: {
        type: String,
        // unique: true,
      },
    },
  ],
  media: {
    type: String,
  },
  mediaType: {
    type: String,
  },
  dateCreated: {
    type: String,
    required: true,
  },
  isAd: {
    type: Boolean,
    default: false,
  },
});

//creating a collection

const Cause = new mongoose.model("Cause", causeSchema);

module.exports = Cause;
