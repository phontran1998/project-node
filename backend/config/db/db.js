const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.u9ydf.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;
const connect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });
    console.log('Connect Successfully Demo Ne');
  } catch (error) {
    console.log('Connect Error');
  }
};

module.exports = { connect };
