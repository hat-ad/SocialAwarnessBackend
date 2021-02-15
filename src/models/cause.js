const mongoose = require("mongoose");

//cause schema
const causeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  },
  { timestamps: { createdAt: "created_at" } }
);

//creating a collection

const Cause = new mongoose.model("Cause", causeSchema);

module.exports = Cause;
