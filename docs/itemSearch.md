# Single Search

Get the details of the marketplace info for the desired item

**URL** : `/api/item-search/:id?enhLevel=ENHANCELEVEL&region=YOURREGION`

**URL Queries** :

- `region` where `region` is either na or eu (case sensitive, must be lowercase). This is `required`.
- `enhLevel` where `enhLevel` is the enhancement level of the desired item. `Optional`, defaults to 0.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns an object in the following format.

```json
{
  "name": "Blackstar Shortsword",
  "itemId": 715009,
  "price": 1780000000,
  "count": 3,
  "enhanceGrade": 16,
  "totalTrades": 319,
  "icon": "https://s1.pearlcdn.com/NAEU/TradeMarket/Common/img/BDO/item/715009.png"
}
```

## Notes

- Price is just the current marketplace average for the item.

- Count is the amount of items currently available on the marketplace.

- Enchance grade is 0 for base and goes up to 20 for PEN.

- Total trades is the total amount of trades done for the item at the enhLevel.
