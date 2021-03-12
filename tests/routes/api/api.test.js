const app = require('../../../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_db_helper');
const api = supertest(app);
const NaItem = require('../../../models/NaItem');
const EuItem = require('../../../models/EuItem');
const { MongoClient } = require('mongodb');


let connection;
let db;

beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    db = await connection.db();

    await NaItem.deleteMany({});
    await EuItem.deleteMany({});

    const naItemObjects = helper.initialItems.map(item => new NaItem(item));
    const euItemObjects = helper.initialItems.map(item => new EuItem(item));
    const naPromiseArr = naItemObjects.map(item => item.save());
    const euPromiseArr = euItemObjects.map(item => item.save());
    const promiseArray = [...naPromiseArr, ...euPromiseArr];

    await Promise.all(promiseArray);
});

afterAll(async () => {
    await connection.close();
});





// //prices route
describe('Prices route', () => {

    // Validation errors correctly error out
    describe('Validation errors', () => {
        test('No category sends error', async () => {
            await api
                .get('/api/prices')
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ error: 'Categories are cooking, alchemy, and fish' });
        });
        test('Invalid category sends error', async () => {
            await api
                .get('/api/prices/cats')
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid category parameter given: cats' });
        });
        test('No region sends error', async () => {
            await api
                .get('/api/prices/cooking')
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' });
        });
        test('Invalid region sends error', async () => {
            await api
                .get('/api/prices/cooking?region=potato')
                .expect(400)
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' });
        });

    });

    describe('Valid category queries', () => {
        test('Cooking returns correctly', async () => {
            await api
                .get('/api/prices/cooking?region=na')
                .expect('Content-Type', /json/)
                .expect([
                    {
                        id: 7347,
                        name: 'Aloe',
                        price: 289000,
                        count: 0,
                        enhLevel: 0,
                        totalTradeCount: 92663,
                        grade: 1
                    }
                ]);

        });
        test('fish returns correctly', async () => {
            await api
                .get('/api/prices/fish?region=na')
                .expect('Content-Type', /json/)
                .expect([
                    {
                        id: 8501,
                        name: 'Dried Mudskipper',
                        price: 289000,
                        count: 0,
                        enhLevel: 0,
                        totalTradeCount: 92663,
                        grade: 1
                    }
                ]);

        });
        test('alchemy returns correctly', async () => {
            await api
                .get('/api/prices/alchemy?region=na')
                .expect('Content-Type', /json/)
                .expect([
                    {
                        id: 5419,
                        name: 'Amanitia Mushroom',
                        price: 289000,
                        count: 0,
                        enhLevel: 0,
                        totalTradeCount: 92663,
                        grade: 1
                    }
                ]);

        });
    });

    // TODO: Figure out how to correctly mock the parallel api calls for routes

});

// item-search route
describe('item-search route', () => {
    let testId = 10006;
    describe('Validation errors', () => {
        test('No id sends error', async () => {
            await api
                .get('/api/item-search')
                .expect('Content-Type', /json/)
                .expect({ error: 'Need a item id' })
                .expect(400);
        });
        test('No region sends error', async () => {
            await api
                .get(`/api/item-search/${testId}`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400);
        });
        test('Invalid region sends error', async () => {
            await api
                .get(`/api/item-search/${testId}?region=potato`)
                .expect('Content-Type', /json/)
                .expect({ error: 'Invalid or no region given' })
                .expect(400);
        });
        test('enhLevel less than 0 returns error', async () => {
            await api
                .get(`/api/item-search/${testId}?region=na&enhLevel=-1`)
                .expect({
                    error: 'Invalid enhLevel: -1 given for id: 10006.  Accessories use 0-5.  Armor and Weapons use 0, 8, 11, 13, 16-20. Any other item uses 0'
                })
                .expect(400);
        });
        test('enhLevel greater than 20 returns error', async () => {
            await api
                .get(`/api/item-search/${testId}?region=na&enhLevel=21`)
                .expect({
                    error: 'Invalid enhLevel: 21 given for id: 10006.  Accessories use 0-5.  Armor and Weapons use 0, 8, 11, 13, 16-20. Any other item uses 0'
                })
                .expect(400);
        });
    });

    describe('Valid route returns correctly', () => {
        test('No enhLevel gives correct response', async () => {
            await api
                .get(`/api/item-search/${10006}?region=na`)
                .expect({
                    "name": "Ain Longsword",
                    "id": 10006,
                    "price": 289000,
                    "count": 0,
                    "enhLevel": 0,
                    "totalTradeCount": 92663,
                    "grade": 1
                })
                .expect(200);
        });

        test('valid enhLevel gives correct response', async () => {
            await api
                .get(`/api/item-search/${10006}?region=na&enhLevel=20`)
                .expect({
                    "name": "Ain Longsword",
                    "id": 10006,
                    "price": 690000000,
                    "count": 0,
                    "enhLevel": 20,
                    "totalTradeCount": 0,
                    "grade": 1
                })
                .expect(200);
        });

    });
});;

// search route
describe('Search route', () => {
    const testIds = [10006, 10009];
    describe('Validation errors', () => {
        test('No ids give sends error', async () => {
            await api
                .get('/api/search')
                .expect(400)
                .expect({ error: 'No Ids given' });

        });
        test('No region given sends error', async () => {
            await api
                .get('/api/search')
                .send({ ids: testIds })
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
        test('Invalid region given sends error', async () => {
            await api
                .get('/api/search?region=potato')
                .send({ ids: testIds })
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
    });

    describe('Valid route requests', () => {
        test('Returns correct content type', async () => {
            await api
                .get('/api/search?region=na')
                .send({ ids: testIds })
                .expect('Content-Type', /json/)
                .expect(200);
        });
        test('Returns correct length', async () => {
            await api
                .get('/api/search?region=na')
                .send({ ids: testIds })
                .expect(200)
                .expect(res => {
                    expect(res.body.length).toBe(18);
                });
        });
    });
});


//caphras calc route
describe('Caphras calc', () => {
    describe('Validation errors', () => {
        test('should send error when no region given', async () => {
            await api
                .get('/api/caphras-calc')
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
        test('should send error when invalid region given', async () => {
            await api
                .get('/api/caphras-calc?region=potato')
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
        test('should send error when no item given', async () => {
            await api
                .get('/api/caphras-calc?region=na')
                .expect(400)
                .expect({ error: 'Invalid or no item given' });
        });
        test('should send error when invalid item given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=INVALID')
                .expect(400)
                .expect({ error: 'Invalid or no item given' });
        });
        test('should send error when no enhLevel given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH')
                .expect(400)
                .expect({ error: 'Invalid or no enhLevel given' });
        });
        test('should send error when invalid enhLevel given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=INVALID')
                .expect(400)
                .expect({ error: 'Invalid or no enhLevel given' });
        });
        test('should send error when invalid curLevel given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=INVALID')
                .expect(400)
                .expect({ error: 'Invalid or no curLevel given. A number 0-19 is needed' });
        });
        test('should send error when no desiredLevel given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=0')
                .expect(400)
                .expect({ error: 'Invalid or no desiredLevel given. A number 1-20 is needed' });
        });
        test('should send error when invalid desiredLevel given', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=0&desiredLevel=INVALID')
                .expect(400)
                .expect({ error: 'Invalid or no desiredLevel given. A number 1-20 is needed' });
        });
        test('should send error when curLevel is greater than desiredLevel', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=2&desiredLevel=1')
                .expect(400)
                .expect({ error: 'desiredLevel must be greater than curLevel' });
        });
    });
    describe('Valid route returns correctly', () => {
        test('should respond with correct content type', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=0&desiredLevel=1')
                .expect(200)
                .expect('Content-Type', /json/);
        });
        test('should return with correct response', async () => {
            await api
                .get('/api/caphras-calc?region=na&item=BossMH&enhLevel=pen&curLevel=0&desiredLevel=1')
                .expect(200)
                .expect({
                    caphrasPrice: 2760000,
                    caphrasNeeded: 297,
                    caphrasAvailable: 0,
                    totalCaphrasPrice: 819720000,
                    stats: { ap: '1 (+1)', accuracy: '0 ' }
                });
        });
    });
});

describe('Item-Upgrade route', () => {
    const body = {
        "armor": {
            "name": "Dim",
            "enhLevel": 19
        },
        "awakening": {
            "name": "Dandelion",
            "enhLevel": 19
        },
        "belt": {
            "name": "Basilisk's Belt",
            "enhLevel": 5
        },
        "boots": {
            "name": "Urugon's",
            "enhLevel": 19
        },
        "characterClass": {
            "name": "dark knight"
        },
        "earring": {
            "name": "Tungrad Earring",
            "enhLevel": 5
        },
        "gloves": {
            "name": "Bheg's",
            "enhLevel": 16
        },
        "helm": {
            "name": "Griffon's",
            "enhLevel": 19
        },
        "mainHand": {
            "name": "Kzarka",
            "enhLevel": 19
        },
        "necklace": {
            "name": "Ogre Ring",
            "enhLevel": 5
        },
        "offhand": {
            "name": "Kutum",
            "enhLevel": 19
        },
        "ring": {
            "name": "Ring of Crescent Guardian",
            "enhLevel": 5
        }
    };
    describe('Validation errors', () => {
        test('should send error when no region given', async () => {
            await api
                .post('/api/item-upgrade')
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
        test('should send error when invalid region given', async () => {
            await api
                .post('/api/item-upgrade?region=INVALID')
                .expect(400)
                .expect({ error: 'Invalid or no region given' });
        });
        test('should send error when invalid key given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    charClass: 'Dark Knight'
                })
                .expect({ error: 'Invalid, missing, or misspelled key in body' });
        });
        test('should send error when invalid character class given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    characterClass: {
                        name: 'INVALID'
                    },

                })
                .expect({ error: 'Invalid or no characterClass given' });
        });
        test('should send error when no character class given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    characterClass: {}
                })
                .expect({ error: 'Invalid or no characterClass given' });
        });
        test('should send error when no weapon enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "mainHand": {
                        "name": "Kzarka",
                    },
                })
                .expect({ error: 'Invalid or no mainHand enhLevel given' });
        });
        test('should send error when invalid weapon enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "mainHand": {
                        "name": "Kzarka",
                        "enhLevel": 69
                    },
                })
                .expect({ error: 'Invalid or no mainHand enhLevel given' });
        });
        test('should send error when no armor enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "armor": {
                        "name": "Dim",
                    }
                })
                .expect({ error: 'Invalid or no armor enhLevel given' });
        });
        test('should send error when invalid armor enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "armor": {
                        "name": "Dim",
                        "enhLevel": 69
                    }
                })
                .expect({ error: 'Invalid or no armor enhLevel given' });
        });
        test('should send error when no accessory enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "ring": {
                        "name": "Ring of Crescent Guardian",
                    }
                })
                .expect({ error: 'Invalid or no ring enhLevel given' });
        });
        test('should send error when invalid accessory enhanceLevel given', async () => {
            await api
                .post('/api/item-upgrade?region=na')
                .send({
                    ...body,
                    "ring": {
                        "name": "Ring of Crescent Guardian",
                        "enhLevel": 69
                    }
                })
                .expect({ error: 'Invalid or no ring enhLevel given' });
        });
    });
    // TODO: Add all items needed to test_db_helper
    // describe('valid route returns correctly', () => {
    //     test('should return with the correct content type', async () => {
    //         await api
    //             .post('/api/item-upgrade?region=na')
    //             .expect(200)
    //             .expect('Content-Type', /json/);
    //     });

    // });
});

describe('Kutum or Nouver route', () => {
    describe('Validation errors', () => {
        test('should return error for no kutumLvl given', async () => {
            await api
                .get('/api/kutum-or-nouver')
                .expect(400)
                .expect({ error: 'Invalid or no kutumLvl given' });
        });
        test('should return error for invalid kutumLvl given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=69')
                .expect(400)
                .expect({ error: 'Invalid or no kutumLvl given' });
        });
        test('should return error for no nouverLvl given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri')
                .expect(400)
                .expect({ error: 'Invalid or no nouverLvl given' });
        });
        test('should return error for invalid nouverLvl given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=69')
                .expect(400)
                .expect({ error: 'Invalid or no nouverLvl given' });
        });
        test('should return error for invalid kutumCaphra given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&kutumCaphra=69')
                .expect(400)
                .expect({ error: 'Invalid kutumCaphra given' });
        });
        test('should return error for invalid nouverCaphra given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&nouverCaphra=69')
                .expect(400)
                .expect({ error: 'Invalid nouverCaphra given' });
        });
        test('should return error for no baseAp given', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri')
                .expect(400)
                .expect({ error: 'Invalid or no baseAp given' });
        });
    });

    describe('valid routes', () => {
        test('should return with correct content type', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&baseAp=250')
                .expect(200)
                .expect('Content-Type', /json/);
        });
        test('should give correct result when ap given is less than 200', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&baseAp=190')
                .expect(200)
                .expect({ bestOffhand: 'Kutum', effectiveApDiff: 'Alot' });
        });
        test('should give correct result when ap given is greater than 300', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&baseAp=3000')
                .expect(200)
                .expect({ bestOffhand: 'Kutum', effectiveApDiff: 'Alot' });
        });
        test('should give correct kutum better result', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&baseAp=263')
                .expect(200)
                .expect({ bestOffhand: 'Kutum', effectiveApDiff: 8 });
        });
        test('should give correct nouver better result', async () => {
            await api
                .get('/api/kutum-or-nouver?kutumLvl=tri&nouverLvl=tri&baseAp=229')
                .expect(200)
                .expect({ bestOffhand: 'Nouver', effectiveApDiff: 10 });
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});