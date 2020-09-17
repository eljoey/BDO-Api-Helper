# Caphras Calculator

Calculate the current price of enhancing an item using Caphras Stones to a desired level.

**URL** : `/api/caphras-calc?item=ITEM&enhLevel=ENHANCELEVEL&curLevel=CURRENTCAPHRASLEVEL&desiredLevel=DESIREDCAPHRASLEVELregion=YOURREGION`

**URL Queries** :

- `item` where `item` is one of `BossMH, BossAwak, BlueMH/Awak, GreenMH/Awak, BossOffhand, GreenOffhand, BossArmor, DimTree, BlueArmor, GreenArmor,`. This is required.
- `enhLevel` where `enhLevel` is one of `tri, tet, pen`. This is required.
- `curLevel` where `curLevel` is the current caphras level of the item to be enhanced. This is required.
- `desiredLevel` where `desiredLevel` is the caphras level that you would like to enhance to. This is required.
- `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of items in the following format.

```json
{
  "caphrasPrice": 3000000,
  "caphrasNeeded": 1560,
  "caphrasAvailable": 0,
  "totalCaphrasPrice": 4680000000,
  "stats": {
    "evasion": "6 ",
    "hidden evasion": "7 (+1)",
    "dr": "6 ",
    "hidden dr": "6 ",
    "hp": "130 (+10)",
    "mp/wp/sp": "0 "
  }
}
```

## Notes

- All queries are required to get a correct response.
