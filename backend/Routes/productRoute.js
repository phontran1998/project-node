const {
  getProductById,
  getAllProduct,
  updateProductById,
  deleProduct,
  createProduct,
  getProductsRelated,
  getListCategoriesFromProducts,
  getPhotoProduct,
} = require('../Controllers/ProductController');
const { isAuth, isAdmin } = require('../Middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(isAuth, isAdmin, createProduct);

router.route('/related/:id').get(getProductsRelated);

router.route('/product/photo/:id').get(getPhotoProduct);

router.route('/categories').get(getListCategoriesFromProducts);

router.route('/:id').get(getProductById).delete(isAuth, isAdmin, deleProduct);

router.route('/:id/edit').put(updateProductById);

router.route('/').get(getAllProduct);
// [DELETE]
module.exports = router;
