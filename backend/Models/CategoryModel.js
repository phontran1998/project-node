const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model('category', categorySchema);
module.exports = CategoryModel;
