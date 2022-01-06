const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost/SP_Cart', {
      useNewUrlParser: true,
    });
    console.log('Connect Successfully Demo');
  } catch (error) {
    console.log('Connect Error');
  }
};

module.exports = { connect };
