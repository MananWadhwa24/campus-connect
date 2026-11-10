const mongoose = require("mongoose");

const marketplaceItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: {
      type: String,
      default: "Student",
    },
    contact: {
      type: String,
      required: [true, "Contact information is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MarketplaceItem", marketplaceItemSchema);
