const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

require('./routes/books')(app)
require('./routes/auth')(app)
mongoose.connect('mongodb://localhost:27017/mern-secure', {useNewUrlParser: true});

app.listen(5000);