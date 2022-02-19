# Cooking Marketplace Prices

Get the details of the marketplace info for the list of cooking items found [here](../../data/Cooking.json).

**URL** : `/api/prices/cooking?region=YOURREGION`

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
  "name": "Aloe",
  "id": 7347,
  "price": 408,
  "count": 143810,
  "enhanceGrade": 0,
  "totalTrades": 151107239,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/7347.png"
}
```

## Notes

- This route is cached and will be upto date within 5 minutes. If not cached the request will take a few seconds to get the info and respond.

- Price is just the current marketplace average for the item.
