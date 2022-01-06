const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel');

exports.isAuth = async (req, res, next) => {
  let token;
  if (req.headers && req.headers.authorization) {
    try {
      // Giai mã token gán cho user
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decoded._id).select(
        '-hased_password'
      );
      next();
    } catch (err) {
      console.log(err);
      const error = new Error('Token không hợp lệ hoặc đã hết hạn');
      error.statusCode = 401;
      return next(error);
    }
  }

  if (!token) {
    const error = new Error('Token không hợp lệ hoặc đã hết hạn');
    error.statusCode = 401;
    return next(error);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    const error = new Error('Chỉ có Admin mới được phép truy cập');
    error.statusCode = 403;
    return next(error);
  }
  next();
};
