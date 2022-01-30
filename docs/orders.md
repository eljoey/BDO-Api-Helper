# Order

Get the current buy and sell orders up for an item

**URL** : `/api/orders?id=YOURID&region=YOURREGION&enhLevel=ENHLEVEL`

**URL Queries** :

- `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.
- `id` where `id` is the item id of the item. This is required.
- `enhLevel` where `enhLevel` is the enhancement level of item. This is not required and defaults to `0` when not given.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a json object in the following format.

```json
{
  "resultCode": 0,
  "resultMsg": "63500-0-10|66500-0-7|68500-0-10|72500-1-0|"
}
```

## Notes

- resultMsg format is `price-sellOrders-buyOrders` seperated by `|`

- Enchance grade is 0 for base and goes up to 20 for PEN.
