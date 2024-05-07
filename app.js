const express = require("express")
const cors = require('cors');
const apiRouter = require('./routes/api-router');
const {invalidPathError, psqlError, generalError} = require("./error_handler")
const app = express()

app.use(cors());
app.use(express.json())
app.use('/api', apiRouter);

app.all('*', invalidPathError)
app.use(psqlError)
app.use(generalError)

module.exports = app