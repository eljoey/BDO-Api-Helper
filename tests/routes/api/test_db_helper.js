const NaItem = require('../../../models/NaItem');
const EuItem = require('../../../models/EuItem');

const initialItems = [
    {
        itemId: 10006,
        name: 'Ain Longsword',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
            {
                count: 0,
                enhLevel: 8,
                grade: 1,
                price: 3370000,
                totalTradeCount: 75,
            },
            {
                count: 0,
                enhLevel: 11,
                grade: 1,
                price: 3880000,
                totalTradeCount: 7,
            },
            {
                count: 0,
                enhLevel: 13,
                grade: 1,
                price: 3880000,
                totalTradeCount: 39
            },
            {
                count: 0,
                enhLevel: 16,
                grade: 1,
                price: 14800000,
                totalTradeCount: 11098
            },
            {
                count: 0,
                enhLevel: 17,
                grade: 1,
                price: 44500000,
                totalTradeCount: 10066
            },
            {
                count: 0,
                enhLevel: 18,
                grade: 1,
                price: 89000000,
                totalTradeCount: 4
            },
            {
                count: 0,
                enhLevel: 19,
                grade: 1,
                price: 306000000,
                totalTradeCount: 1
            },
            {
                count: 0,
                enhLevel: 20,
                grade: 1,
                price: 690000000,
                totalTradeCount: 0
            }
        ]
    },
    {
        itemId: 10009,
        name: 'Liverto Longsword',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
            {
                count: 0,
                enhLevel: 8,
                grade: 1,
                price: 3370000,
                totalTradeCount: 75,
            },
            {
                count: 0,
                enhLevel: 11,
                grade: 1,
                price: 3880000,
                totalTradeCount: 7,
            },
            {
                count: 0,
                enhLevel: 13,
                grade: 1,
                price: 3880000,
                totalTradeCount: 39
            },
            {
                count: 0,
                enhLevel: 16,
                grade: 1,
                price: 14800000,
                totalTradeCount: 11098
            },
            {
                count: 0,
                enhLevel: 17,
                grade: 1,
                price: 44500000,
                totalTradeCount: 10066
            },
            {
                count: 0,
                enhLevel: 18,
                grade: 1,
                price: 89000000,
                totalTradeCount: 4
            },
            {
                count: 0,
                enhLevel: 19,
                grade: 1,
                price: 306000000,
                totalTradeCount: 1
            },

            {
                count: 0,
                enhLevel: 20,
                grade: 1,
                price: 690000000,
                totalTradeCount: 0
            }
        ]
    },
    {
        itemId: 10003,
        name: 'Elsh Longsword',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
            {
                count: 0,
                enhLevel: 8,
                grade: 1,
                price: 3370000,
                totalTradeCount: 75,
            },
            {
                count: 0,
                enhLevel: 11,
                grade: 1,
                price: 3880000,
                totalTradeCount: 7,
            },
            {
                count: 0,
                enhLevel: 13,
                grade: 1,
                price: 3880000,
                totalTradeCount: 39
            },
            {
                count: 0,
                enhLevel: 16,
                grade: 1,
                price: 14800000,
                totalTradeCount: 11098
            },
            {
                count: 0,
                enhLevel: 17,
                grade: 1,
                price: 44500000,
                totalTradeCount: 10066
            },
            {
                count: 0,
                enhLevel: 18,
                grade: 1,
                price: 89000000,
                totalTradeCount: 4
            },
            {
                count: 0,
                enhLevel: 19,
                grade: 1,
                price: 306000000,
                totalTradeCount: 1
            },

            {
                count: 0,
                enhLevel: 20,
                grade: 1,
                price: 690000000,
                totalTradeCount: 0
            }
        ]
    },
    {
        itemId: 5419,
        name: 'Amanitia Mushroom',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
        ]
    },
    {
        itemId: 7347,
        name: 'Aloe',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
        ]
    },
    {
        itemId: 8501,
        name: 'Dried Mudskipper',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 1,
                price: 289000,
                totalTradeCount: 92663,
            },
        ]
    },
    {
        itemId: 721003,
        name: 'Caphras Stone',
        prices: [
            {
                count: 0,
                enhLevel: 0,
                grade: 2,
                price: 2760000,
                totalTradeCount: 121993002,
            },
        ]
    }
];

const itemsInDb = async (region) => {
    const RegionItem = region === 'na' ? NaItem : EuItem;

    const items = await RegionItem.find();

    return items.map(item => item.toJSON());
};

module.exports = {
    initialItems,
    itemsInDb,
};

