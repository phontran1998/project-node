const {
  createCategory,
  getCategoryById,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require('../Controllers/CategoryController');
const { isAuth, isAdmin } = require('../Middleware/authMiddleware');

const router = require('express').Router();

router.route('/create').post(isAuth, isAdmin, createCategory);

router.route('/:id/edit').put(updateCategory);

router.route('/:id').get(getCategoryById).delete(deleteCategory);

router.route('/').get(getAllCategory);

module.exports = router;
