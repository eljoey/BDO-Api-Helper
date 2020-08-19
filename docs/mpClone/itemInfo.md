# Item-Info Marketplace Clone

Get the detailed marketplace info of an item.

**URL** : `/marketplace-clone/item-info/:mainKey?region=YOURREGION`

**URL Parameters** : `mainKey=[integer]` where `mainKey` is the itemId.

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of item/s in the following format.

```json
{
  "detailList": [
    {
      "pricePerOne": 118000000,
      "totalTradeCount": 10872,
      "keyType": 0,
      "mainKey": 10010,
      "subKey": 0,
      "count": 2,
      "name": "Kzarka Longsword",
      "grade": 3,
      "mainCategory": 1,
      "subCategory": 1,
      "chooseKey": 0
    }
  ],

  "resultCode": 0,
  "resultMsg": ""
}
```

## Notes

- **pricePerOne -** is the marketplace price of the item.

- **totalTradeCount -** is the overall total lifetime(or atleast until the implementation of the new marketplace) sales for the item at that grade enhancement.

- **keyType -** no idea what this is.

- **mainKey -** is the itemId.

- **subKey -** is the enhancement level.

- **count -** is the current ammount on the marketplace.

- **grade -** is the rarity:
  | Grade | Rarity |
  | ----- | ----- |
  |0 | White |
  |1 | Green |
  |2 | Blue |
  |3 | Yellow |
  |4 | Red |

- **mainCategory && subCategory -** are the tabs where the item was found in the marketplace. Can ignore this information.

- **chooseKey -** I have no idea what this is for, but it looks like it might also be for the enhancement level.

- I have no idea what resultCode and resultMsg are for.
