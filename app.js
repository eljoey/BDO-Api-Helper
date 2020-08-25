const express = require('express');
const config = require('./utils/config');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyparser.json());

//Routes
const apiRouter = require('./routes/api');
const mpCloneRouter = require('./routes/mpClone');

app.use('/api', apiRouter);
app.use('/marketplace-clone', mpCloneRouter);

const PORT = config.PORT || '3000';
app.listen(PORT, console.log(`Listening on port ${PORT}`));
