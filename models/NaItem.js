const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemId: Number,
    name: String,
    prices: Array,
});

itemSchema.methods.getEnhLevel = function (level) {
    let itemInfo = this.prices.find(item => item.enhLevel == level);

    if (!itemInfo) {
        return;
    }

    let info = {
        id: this.itemId,
        name: this.name,
        price: itemInfo.price,
        count: itemInfo.count,
        enhLevel: itemInfo.enhLevel,
        totalTradeCount: itemInfo.totalTradeCount,
        grade: itemInfo.grade
    };

    return info;
};

itemSchema.virtual('formatAllPrices').get(function () {
    let results = [];

    for (let i = 0; i < this.prices.length; i++) {
        let data = this.prices[i];

        let info = {
            id: this.itemId,
            name: this.name,
            price: data.price,
            count: data.count,
            enhLevel: data.enhLevel,
            totalTradeCount: data.totalTradeCount
        };

        results.push(info);
    }

    return results;
});

const Item = mongoose.model('NaItem', itemSchema);

module.exports = Item;