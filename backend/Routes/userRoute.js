const {
  signIn,
  signUp,
  signOut,
  getUserById,
  getUserProfile,
  updateUserProfile,
} = require('../Controllers/UserController');
const { isAuth, isAdmin } = require('../Middleware/authMiddleware');

const router = require('express').Router();

router.route('/signin').post(signIn);

router.route('/signup').post(signUp);

router.route('/signout').get(isAuth, signOut);

router.route('/profile/edit').put(isAuth, updateUserProfile);

router.route('/profile').get(isAuth, getUserProfile);

router.route('/:id').get(isAuth, isAdmin, getUserById);

module.exports = router;
