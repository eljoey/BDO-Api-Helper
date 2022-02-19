# Alchemy Marketplace Prices

Get the details of the marketplace info for the list of alchemy items found [here](../../data/Alchemy.json).

**URL** : `/api/prices/alchemy?region=YOURREGION&lang=YOURLANG`

**URL Queries** :

- `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.
- `lang` where `lang` is either en (english), es (spanish), de (german) or fr (french). This is optional, default is en

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of items in the following format

```json
{
  "name": "Amanita Mushroom",
  "id": 5419,
  "price": 2630,
  "count": 0,
  "enhanceGrade": 0,
  "totalTrades": 1171642,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/5419.png"
}
```

## Notes

- This route is cached and will be upto date within 5 minutes. If not cached the request will take a few seconds to get the info and respond.

- Price is just the current marketplace average for the item.
