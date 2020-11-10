const express = require('express');
const config = require('./utils/config');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const middleware = require('./utils/middleware');
const alertChecker = require('./utils/alertChecker');

const app = express();

// MongoDB connection
const mongoose = require('mongoose');
const BDO_STUFF_DB = config.BDO_STUFF_DB;
mongoose.connect(BDO_STUFF_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log('Connected to BDO-Stuff Database'); });

//Middleware
app.use(cors());
app.use(bodyparser.json());
app.use(cookieParser());
app.use(middleware.getToken);

//Alert checker for Bdo-Stuff
// alertChecker();


//Routes
const apiRouter = require('./routes/api');
const mpCloneRouter = require('./routes/mpClone');
const bdoStuffRouter = require('./routes/bdo-stuff');

app.use('/api', apiRouter);
app.use('/marketplace-clone', mpCloneRouter);
app.use('/bdo-stuff/', bdoStuffRouter);

//error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const PORT = config.PORT || '3000';
app.listen(PORT, console.log(`Listening on port ${PORT}`));
