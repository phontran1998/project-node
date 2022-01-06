const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const db = require('../backend/config/db/db');
const morgan = require('morgan');
const router = require('./Routes/mainRoute');

const { errorHandler } = require('./helper/errorHandler');

// CORS
app.use(cors());
// Config file env
dotenv.config();

// Connect DB
db.connect();

// Body Pare and Json Parse
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Logger
app.use(morgan('dev'));

// Router
router(app);

// Handler Error
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`App listenning at port ${process.env.PORT}`)
);
