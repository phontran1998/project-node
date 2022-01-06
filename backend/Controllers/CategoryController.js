const CategoryModel = require('../Models/CategoryModel');

exports.createCategory = async (req, res, next) => {
  const category = new CategoryModel(req.body);
  await category.save();
  res.status(201).json({
    category,
  });
};

exports.getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findOne({ _id: id });
    if (!category) {
      const error = new Error('Category không tồn tại');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await CategoryModel.find();
    if (!categories) {
      const error = new Error('Không có sản phẩm nào');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      categories,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findOne({ _id: id });
    if (!category) {
      const error = new Error('Category không tồn tại');
      error.statusCode = 404;
      return next(error);
    }
    category.name = req.body.name;
    await category.save();

    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findOne({ _id: id });
    if (!category) {
      const error = new Error('Category không tồn tại');
      error.statusCode = 404;
      return next(error);
    }

    await CategoryModel.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: 'Xóa category thành công',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
