const mongoose = require("mongoose");

//cause schema
const adSchema = new mongoose.Schema({
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
  interest_count: [
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
    default: true,
  },
});

//creating a collection

const Advertisement = new mongoose.model("Advertisement", adSchema);

module.exports = Advertisement;
