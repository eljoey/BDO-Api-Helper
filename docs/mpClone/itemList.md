# Item-List Marketplace Clone

Is a clone of the marketplaces broad list of a type of item (ex. main weapon mainCategory and longsword subCategory).

**URL** : `/marketplace-clone/item-list/:mainCategory/:subCategory?region=YOURREGION`

**URL Parameters** : `mainCategory=[integer]` where `mainCategory` is the number of the main tab (Main Weapon, Sub Weapon, etc.)

**URL Parameters** : `subCategory=[integer]` where `subCategory` is the number of the sub tab (with Main Weapon as the mainCategory. It will have subs such as longsword, longbow, etc.)
server.

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

For some reason BDO makes it go as following:

| Category            | main | sub      |
| ------------------- | ---- | -------- |
| Main Weapon         | 1    | (1 - 13) |
| Sub Weapon          | 5    | (1 - 12) |
| Awakening Weapon    | 10   | (1 - 18) |
| Armor               | 15   | (1 - 6)  |
| Accessories         | 20   | (1 - 4)  |
| Material            | 25   | (1 - 8)  |
| Enhancement/Upgrade | 30   | (1 - 2)  |
| Consumables         | 35   | (1 - 8)  |
| Life Tools          | 40   | (1 - 10) |
| Alchemy Stone       | 45   | (1 - 4)  |
| Magic Crystal       | 50   | (1 - 7)  |
| Pearl Item          | 55   | (1 - 8)  |
| Dye                 | 60   | (1 - 8)  |
| Mount               | 65   | (1 - 12) |
| Ship                | 70   | (1 - 9)  |
| Wagon               | 75   | (1 - 6)  |
| Furniture           | 80   | (1 - 9)  |
| Lightstone          | 85   | (1 - 5)  |

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a json in the following format.

```json
{
  "marketList": [
    {
      "mainKey": 10005,
      "sumCount": 1,
      "totalSumCount": 485056,
      "name": "Azwell Longsword",
      "grade": 1,
      "minPrice": 17500
    }
  ],
  "resultCode": 0,
  "resultMsg": ""
}
```

## Notes

- **mainKey -** is the itemId.

- **sumCount -** is the total of that item (from base to PEN) on mp.

- **totalSumCount -** is the overall total lifetime(or atleast until the implementation of the new marketplace) sales for the item at all enhancement levels combined.

- **grade -** is the rarity:
  | Grade | Rarity |
  | ----- | ----- |
  |0 | White |
  |1 | Green |
  |2 | Blue |
  |3 | Yellow |
  |4 | Red |

- **minPrice -** is the price for the base item regardless of enhancement level.

- I have no idea what resultCode and resultMsg are for.
