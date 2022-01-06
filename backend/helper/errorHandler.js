exports.errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Lỗi server';
  res.status(error.statusCode).json({
    stauts: 'fail',
    message: error.message,
  });
};
