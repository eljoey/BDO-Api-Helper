const itemIds = require('../data/items');
const helpers = require('./helpers');
const async = require('async');
const NaItem = require('../models/NaItem');
const EuItem = require('../models/EuItem');



const getNAPrices = async () => {
    const itemsParallelSetup = helpers.parallelSetup(itemIds.na, 'na');

    console.log('Starting NA price fetch...');

    async.parallelLimit(itemsParallelSetup, 50, (err, results) => {
        if (err) console.log(err);

        console.log('Adding NA items to DB');
        let count = 0;

        // TODO: try to see if turning this into a Promise.all will make it faster.
        results.map(async itemsList => {
            let itemList = itemsList.detailList;

            // Will not add itemId that returns no info.
            if (!itemList.length) return;

            let itemsArr = itemList.map(item => {
                return {
                    count: item.count,
                    enhLevel: item.subKey,
                    grade: item.grade,
                    price: item.pricePerOne,
                    totalTradeCount: item.totalTradeCount
                };
            });


            try {
                let foundItem = await NaItem.findOne({ name: itemList[0].name });

                // Will create new NaItem if there was not any found, else it will update the prices field to correct prices
                if (!foundItem) {
                    let formatedItem = new NaItem({
                        itemId: itemList[0].mainKey,
                        name: itemList[0].name,
                        prices: itemsArr
                    });
                    await formatedItem.save();
                } else {
                    await NaItem.updateOne({ name: itemList[0].name }, { prices: itemsArr }, { upsert: true });
                }

            } catch (err) {
                console.log(err);
            }

            //Prints out progress
            const totalItems = itemIds.na.length;
            count++;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`${count}/${totalItems}...${((count / totalItems) * 100).toFixed(2)}%`);
        });

    });

};

const getEUPrices = async () => {
    const itemsParallelSetup = helpers.parallelSetup(itemIds.eu, 'eu');


    // await EuItem.deleteMany();
    console.log('Starting EU price fetch...');

    async.parallelLimit(itemsParallelSetup, 50, (err, results) => {
        if (err) console.log(err);

        console.log('Adding EU items to DB');
        let count = 0;

        results.map(async itemsList => {
            let itemList = itemsList.detailList;

            // Will not add itemId that returns no info.
            if (!itemList.length) return;

            let itemsArr = itemList.map(item => {
                return {
                    count: item.count,
                    enhLevel: item.subKey,
                    grade: item.grade,
                    price: item.pricePerOne,
                    totalTradeCount: item.totalTradeCount
                };
            });


            try {
                let foundItem = await EuItem.findOne({ name: itemList[0].name });

                // Will create new EuItem if there was not any found, else it will update the prices field to correct prices
                if (!foundItem) {
                    let formatedItem = new EuItem({
                        itemId: itemList[0].mainKey,
                        name: itemList[0].name,
                        prices: itemsArr
                    });
                    await formatedItem.save();
                } else {
                    await EuItem.updateOne({ name: itemList[0].name }, { prices: itemsArr }, { upsert: true });
                }

            } catch (err) {
                console.log(err);
            }

            //Prints out progress
            const totalItems = itemIds.eu.length;
            count++;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`${count}/${totalItems}...${((count / totalItems) * 100).toFixed(2)}%`);
        });
    });
};

// 30m interval
const timeInterval = 30 * 60 * 1000;

const updatePrices = async () => {

    await getNAPrices();
    await getEUPrices();
};
module.exports = updatePrices;