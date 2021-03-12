# Cooking Marketplace Prices

Get the details of the marketplace info for the list of cooking items found [here](../../data/Cooking.json).

**URL** : `/api/prices/cooking?region=YOURREGION`

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of items in the following format

```json
{
  "id": 7347,
  "name": "Aloe",
  "price": 595,
  "count": 53698,
  "enhLevel": 0,
  "totalTradeCount": 98879455,
  "grade": 0
}
```

## Notes

- This route is cached and will be upto date within 5 minutes. If not cached the request will take a few seconds to get the info and respond.

- Price is just the current marketplace average for the item.
