const UserModel = require('../Models/UserModel');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      const error = new Error('Tài khoản chưa tồn tại');
      error.statusCode = 403;
      return next(error);
    }

    // Xác thực mật khẩu
    if (!user.authenticate(password)) {
      const error = new Error('Sai tài khoản hoặc mật khâir');
      error.statusCode = 401;
      return next(error);
    }

    // Tạo Token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Set Cookie
    res.cookie('token', token, { expire: new Date() + 999 });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExits = await UserModel.findOne({ email });

    if (userExits) {
      const error = new Error('Tài khoản đã tồn tại');
      error.statusCode = 403;
      return next(error);
    }

    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json({
      user,
    });

    // Tạo User ở đây
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.signOut = async (req, res, next) => {
  res.clearCookie('token');
  res.json({
    message: 'Đăng xuất thành công',
  });
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      const error = new Error('User không tồn tại');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      userInfo: user,
    });
  } catch (err) {
    const error = new Error('Lỗi server');
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });

    if (!user) {
      const error = new Error('User không tồn tại');
      error.statusCode = 404;
      return next(error);
    }

    user.hashed_password = undefined;
    user.salt = undefined;

    res.status(200).json({
      userProfile: user,
    });
  } catch (err) {
    const error = new Error('Lỗi server');
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });

    if (!user) {
      const error = new Error('User không tồn tại');
      error.statusCode = 404;
      return next(error);
    }
    const updatedUserProfile = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { $set: req.body },
      { new: true }
    );

    updatedUserProfile.hashed_password = undefined;
    updatedUserProfile.salt = undefined;

    res.status(200).json({
      userProfileUpdate: updatedUserProfile,
    });
  } catch (err) {
    const error = new Error('Lỗi server');
    next(error);
  }
};
