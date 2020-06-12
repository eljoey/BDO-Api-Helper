# Item-Pricing Marketplace Clone

Get the detailed marketplace info of an item

**URL** : `/api/marketplace-clone/item-pricing/:mainKey/subKey`

**URL Parameters** : `mainKey=[integer]` where `mainKey` is the itemId

**URL Parameters** : `subKey=[integer]` where `subKey` is the enhacement level (0 for base and up to 20 for PEN)

**Method** : `GET`

**Auth required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

Returns json in the following format

```json
{
  "priceList": [
    14900000000,
    15000000000,
    15100000000,
    15200000000,
    15300000000,
    15400000000,
    15500000000,
    15600000000,
    15700000000,
    15800000000,
    15900000000,
    16000000000
  ],
  "marketConditionList": [
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 13800000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 13900000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14000000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14100000000
    },
    {
      "sellCount": 0,
      "buyCount": 1,
      "pricePerOne": 14200000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14300000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14400000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14500000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14600000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14700000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14800000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 14900000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15000000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15100000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15200000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15300000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15400000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15500000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15600000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 15700000000
    },
    {
      "sellCount": 1,
      "buyCount": 0,
      "pricePerOne": 15800000000
    },
    {
      "sellCount": 1,
      "buyCount": 0,
      "pricePerOne": 15900000000
    },
    {
      "sellCount": 0,
      "buyCount": 0,
      "pricePerOne": 16000000000
    }
  ],
  "basePrice": 14900000000,
  "enchantGroup": 20,
  "enchantMaxGroup": 20,
  "enchantMaterialKey": 0,
  "enchantMaterialPrice": 0,
  "enchantNeedCount": 0,
  "maxRegisterForWorldMarket": 5,
  "countValue": 0,
  "sellMaxCount": 0,
  "buyMaxCount": 0,
  "resultCode": 0,
  "resultMsg": "Data will be here. I removed it from this example."
}
```

## Notes

- **priceList -** is the current range of prices.

- **marketConditionList -** array of price values and buy/sell orders.

  - **sellCount -** current ammount up for sale
  - **buyCount -** current ammount of buy orders up
  - **pricePerOne -** price to buy/sell at

- **basePrice -** average price.

- **enchantGroup -** min enhantment level for the group (ex. when you go to base Kzarka the enchantment group will be 0-7 thus min will be 0 ).

- **enchantMaxGroup -** max enhantment level for the group (ex. when you go to base Kzarka the enchantment group will be 0-7 thus max will be 7 ).

- **enchantMaterialKey -** the itemId of the material used to enhance the current item (if there is none it will be 0)

- **enchantMaterialPrice -** the average marketplace price of the material used to enhance the current item (if there is none it will be 0)

- **enchantNeedCount -** unsure what this is for.

- **maxRegisterForWorldMarket -** is the max ammount you can register on the market of that item.

- **countValue -** unsure what this is for.

- **sellMaxCount -** unsure what this is for.

- **buyMaxCount -** unsure what this is for.

- **resultCode -** unsure what this is for.

- **resultMsg -** I'm assuming this is the data they use for the graph.
