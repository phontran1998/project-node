const userRoute = require('./userRoute');
const productRoute = require('./productRoute');
const categoryRoute = require('./categoryRoute');

const router = (app) => {
  app.use('/api/users', userRoute);

  app.use('/api/category', categoryRoute);

  app.use('/api/products', productRoute);
};

module.exports = router;
