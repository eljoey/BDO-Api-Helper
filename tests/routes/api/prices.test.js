const apiRouter = require('../../../routes/api');;
const nock = require('nock');
const request = require('supertest');
const express = require('express');
const mockResponse = require('./mockResponses');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/api', apiRouter);

//reset nock before each test
beforeEach((done) => {
    if (!nock.isActive()) nock.activate();
    done();
});


//prices route
describe('Prices route', () => {
    // Validation errors correctly error out
    describe('Validation errors', () => {
        test('No category sends error', done => {
            request(app)
                .get('/api/prices/')
                .expect('Content-Type', /json/)
                .expect({ error: 'Categories are cooking, alchemy, and fish' })
                .expect(400, done);
        });
        test('Invalid category sends error', done => {
            request(app)
                .get('/api/prices/cats')
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid category parameter given: cats' })
                .expect(400, done);
        });
        test('No region sends error', done => {
            request(app)
                .get('/api/prices/cooking')
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400, done);
        });
        test('Invalid region sends error', done => {
            request(app)
                .get('/api/prices/cooking?region=potato')
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400, done);
        });
    });

    // describe('Valid category queries', () => {
    //     test('Cooking returns correctly', done => {
    //         nock('https://marketweb-na.blackdesertonline.com/Home')
    //             .post('/GetWorldMarketSubList')
    //             .reply(200, mockResponse.cookingMat);

    //         request(app)
    //             .get('/api/prices/cooking?region=na')
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 console.log(res.body);
    //             }, done);

    //     });
    // });

    // TODO: Figure out how to correctly mock the parallel api calls for routes
});

// item-search route
describe('item-search route', () => {
    describe('Validation errors', () => {
        test('No id sends error', done => {
            request(app)
                .get('/api/item-search')
                .expect('Content-Type', /json/)
                .expect({ error: 'Need a item id' })
                .expect(400, done);
        });
        test('No region sends error', done => {
            request(app)
                .get('/api/item-search/699')
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400, done);
        });
        test('Invalid region sends error', done => {
            request(app)
                .get('/api/item-search/699?region=potato')
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400, done);
        });
        test('enhLevel less than 0 returns error', done => {
            request(app)
                .get('/api/item-search/699?region=na&enhLevel=-1')
                .expect({ "error": "Invalid enhLevel.  Only valid from 0-20" })
                .expect(400, done);
        });
        test('enhLevel greater than 20 returns error', done => {
            request(app)
                .get('/api/item-search/699?region=na&enhLevel=21')
                .expect({ "error": "Invalid enhLevel.  Only valid from 0-20" })
                .expect(400, done);
        });
    });

    describe('Valid route returns correctly', () => {
        beforeEach(() => {
            nock('https://marketweb-na.blackdesertonline.com/Home')
                .post('/GetWorldMarketSubList')
                .reply(200, mockResponse.itemSearch);
        });

        test('No enhLevel gives correct response', done => {
            request(app)
                .get('/api/item-search/699?region=na')
                .expect({
                    "name": "Blackstar Longsword",
                    "id": 715001,
                    "price": 620000000,
                    "count": 0,
                    "enhanceGrade": 0,
                    "totalTrades": 194
                })
                .expect(200, done);
        });

        test('valid enhLevel gives correct response', done => {
            request(app)
                .get('/api/item-search/699?region=na&enhLevel=20')
                .expect({
                    "name": "Blackstar Longsword",
                    "id": 715001,
                    "price": 99500000000,
                    "count": 0,
                    "enhanceGrade": 20,
                    "totalTrades": 12
                })
                .expect(200, done);
        });

    });
});;

// search route
    // no ids given
    // region check
    // mock call
    // length check

//caphras calc route
    // error checks
        // invalid region
        // no item given
        // invalid item given
        // no enh level given
        // invalid enh level given
        // no curLevel given
        // invalid curlevel given
        // no desired level given
        // invalid curlevel given
        // desired level not greater than or equal to cur level
    // returns correct for good route
        // check all info

// item upgrade route
    // error checks
        // no region
        // invalid region
        // bad key given
        // bad name
        // no name
        // no weapon enh level
        // bad weapon enh level
        // no armor enh level
        // bad armor enh level
        // no acc enh level
        // bad acc enh level
    // good check correct return

// kutum or nouver
    // error checks
        // no region
        // invalid region
        // no nouver level
        // invalid nouver level
        // no kutum level
        // invalid kutum level
        // no kutum caphra defaults to 0
        // invalid kutum caphra
        // no nouver caphra defaults to 0
        // invalid nouver caphra
    // base ap < 200 check
    // base ap > 300 check
    // kutum better check
    // nouver better check