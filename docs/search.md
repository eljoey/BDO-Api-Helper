# Custom Search

Get the details of the marketplace info for the list of items sent in the body of the request.

**URL** : `/api/search?region=YOURREGION`

**URL Queries** :

- `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.
- `lang` where `lang` is either en (english), es (spanish), de (german) or fr (french). This is optional, default is en

**Method** : `POST`

**Data constraints**

```json
{
  "ids": ["valid item ids here"]
}
```

**Data example**

```json
{
  "ids": [721003, 10010]
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of items in the following format.

```json
{
  "name": "Caphras Stone",
  "id": 721003,
  "price": 2800000,
  "count": 0,
  "enhanceGrade": 0,
  "totalTrades": 269054051,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/721003.png"
},
{
  "name": "Kzarka Longsword",
  "id": 10010,
  "price": 220000000,
  "count": 1,
  "enhanceGrade": 0,
  "totalTrades": 17433,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/10010.png"
},
...
{
  "name": "Kzarka Longsword",
  "id": 10010,
  "price": 8050000000,
  "count": 2,
  "enhanceGrade": 20,
  "totalTrades": 631,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/10010.png"
}
```

## Notes

- Ids must be sent in the body of the request. Will accept any ammount of ids but the longer the list of ids the longer a request will take.

- Price is just the current marketplace average for the item.

- Enchance grade is 0 for base and goes up to 20 for PEN.
