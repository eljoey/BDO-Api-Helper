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
app.use(cors({ credentials: true, origin: ['https://bdo-stuff.netlify.app', 'http://localhost:3000', 'http://localhost:3001', 'https://bdo-api-helper.herokuapp.com'] }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(middleware.getToken);

//Block annoying bots
const ipfilter = require('express-ipfilter').IpFilter;
const blockedIps = ['198.23.249.229', "96.227.114.108"];
app.use(ipfilter(blockedIps));

app.use((req, res, next) => {
    const ip2 = req.headers['x-forwarded-for'];

    if (blockedIps.contains(ip2)) {
        console.log('------THIS BLOCK WORKED------');
        res.status(403).json({ error: 'restricted access' });
    }

    console.log('IP --2-- =======', ip2);
    next();
});

//Alert checker for Bdo-Stuff
alertChecker();


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
