const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1 } = require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// Field password ảo
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = v1();
    // Mã hóa password
    this.hashed_password = this.encryptPassword(password); // password bị mã hóa
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // Method mã hóa password
  encryptPassword: function (password) {
    if (!password) return '';

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      console.log(error);
      return '';
    }
  },

  // Method xác thực password
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};
const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;
