# Dried Fish Marketplace Prices

Get the details of the marketplace info for the list of fish items found [here](../../Ingredients/fish.json).

**URL** : `/api/prices/fish`

**Method** : `GET`

**Auth required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of items in the following format

```json
{
  "name": "Dried Mudskipper",
  "price": 3420,
  "count": 0,
  "enhanceGrade": 0
}
```

## Notes

- This route is cached and will be upto date within 5 minutes. If not cached the request will take a few seconds to get the info and respond.

- Price is just the current marketplace average for the item.
