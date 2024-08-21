const express = require("express");
const app = express();

const cors = require('cors');

app.use(cors({
  origin:'http://localhost:5173',
}));

app.use(express.json());

const { authRouter } = require('./routes/auth.routes.js');

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('done');
});

module.exports = { app }