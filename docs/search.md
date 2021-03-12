# Custom Search

Get the details of the marketplace info for the list of items sent in the body of the request.

**URL** : `/api/search?region=YOURREGION`

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

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
({
  "id": 721003,
  "name": "Caphras Stone",
  "price": 2550000,
  "count": 57087,
  "enhLevel": 0,
  "totalTradeCount": 116757366
},
...
{
  "id": 10010,
  "name": "Kzarka Longsword",
  "price": 109000000,
  "count": 4,
  "enhLevel": 0,
  "totalTradeCount": 13725
})
```

## Notes

- Automatically removes duplicate ids.

- Will return all enhancement levels for each item id.

- Ids must be sent in the body of the request. Will accept any ammount of ids but the longer the list of ids the longer a request will take.

- Price is just the current marketplace average for the item.

- Enchance grade is 0 for base and goes up to 20 for PEN.
