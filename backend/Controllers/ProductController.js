const ProductModel = require('../Models/ProductModel');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      const error = new Error('Sản phẩm không tồn tại');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      product,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getAllProduct = async (req, res, next) => {
  // get sản phẩm theo điều kiện
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
    const products = await ProductModel.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit);

    if (!products) {
      const error = new Error('Không có sản phẩm nào');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      products,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getProductsRelated = async (req, res, next) => {
  const { id } = req.params;
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  try {
    const product = await ProductModel.findById({ _id: id });

    if (!product) {
      const error = new Error('Không có sản phẩm nào');
      error.statusCode = 404;
      return next(error);
    }

    // Danh sách Sản phẩm liên quan
    const productsRelated = await ProductModel.find({
      _id: { $ne: id },
      category: product.category,
    })
      .limit(limit)
      .populate('category', '_id name');

    if (!productsRelated) {
      const error = new Error('Không có sản phẩm liên quan nào');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      productsRelated,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getListCategoriesFromProducts = async (req, res, next) => {
  try {
    const categoryList = await ProductModel.distinct('category');

    if (!categoryList) {
      const error = new Error('Không có category nào');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      categoryList,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      const error = new Error('Sản phẩm không tồn tại');
      error.statusCode = 404;
      return next(error);
    }

    await ProductModel.findByIdAndDelete({ _id: id });
    res.json({
      message: 'Xóa sản phẩm thành công',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createProduct = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  // Xử lý upload file với func parse
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        const error = new Error('Hình ảnh khổng được upload');
        error.statusCode = 400;
        return next(error);
      }
      const { name, description, price, category, quantity, shipping } = fields;

      // Validate form
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        const error = new Error('Field không được để trống');
        error.statusCode = 400;
        return next(error);
      }

      let product = new ProductModel(fields);

      if (files.photo) {
        if (files.photo.size) {
          const error = new Error('Hình ảnh khổng được được quá 3mb');
          error.statusCode = 400;
          return next(error);
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }
      await product.save();

      if (!product) {
        const error = new Error('Tạo sản phẩm thất bại');
        error.statusCode = 400;
        return next(error);
      }

      res.status(201).json({
        product,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
};

exports.updateProductById = async (req, res, next) => {
  const { id } = req.params;

  let form = new formidable.IncomingForm();

  form.keepExtensions = true;
  // Xử lý upload file với func parse
  form.parse(req, async (err, fields, files) => {
    try {
      let product = await ProductModel.findOne({ _id: id });

      if (!product) {
        const error = new Error('Sản phẩm không tồn tại');
        error.statusCode = 404;
        return next(error);
      }

      if (err) {
        const error = new Error('Hình ảnh khổng được upload');
        error.statusCode = 400;
        return next(error);
      }

      const { name, description, price, category, quantity, shipping } = fields;

      // Validate form
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        !shipping
      ) {
        const error = new Error('Field không được để trống');
        error.statusCode = 400;
        return next(error);
      }

      // coppy filed input cho product
      product = _.extend(product, fields);

      console.log(product);

      if (files.photo) {
        if (files.photo.size) {
          const error = new Error('Hình ảnh khổng được được quá 3mb');
          error.statusCode = 400;
          return next(error);
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: id },
        product,
        {
          new: true,
        }
      );

      res.status(201).json({
        updatedProduct,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
};

exports.getPhotoProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findOne({ _id: id });
    if (!product) {
      const error = new Error('Sản phẩm không tồn tại');
      error.statusCode = 404;
      return next(error);
    }

    if (product.photo.data) {
      res.set('Content-type', product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
