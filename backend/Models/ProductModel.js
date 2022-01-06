const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    quantity: {
      type: Number,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      required: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('product', productSchema);
module.exports = ProductModel;
