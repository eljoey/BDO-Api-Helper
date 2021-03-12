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
  "id": 715009,
  "name": "Blackstar Shortsword",
  "price": 630000000,
  "count": 0,
  "enhLevel": 0,
  "totalTradeCount": 278,
  "grade": 4
}
```

## Notes

- Price is just the current marketplace average for the item.

- Count is the amount of items currently available on the marketplace.

- Enchance grade is 0 for base and goes up to 20 for Armor/Weapons and 5 for Accessories.

- Total trades is the total amount of trades done for the item at the enhLevel.

- Grade is the quality of of the item.
