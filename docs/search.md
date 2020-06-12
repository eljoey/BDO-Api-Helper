# Custom Search

Get the details of the marketplace info for the list of items sent in the body of the request.

**URL** : `/api/prices/fish`

**Method** : `GET`

**Auth required** : None

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

Returns a list of items in the following format

```json
{
    "name": "Caphras Stone",
    "price": 2800000,
    "count": 84613,
    "enhanceGrade": 0
},
...
{
    "name": "Kzarka Longsword",
    "price": 14900000000,
    "count": 2,
    "enhanceGrade": 20
}
```

## Notes

- Ids must be sent in the body of the request. Will accept any ammount of ids but the longer the list of ids the longer a request will take.

- Price is just the current marketplace average for the item.

- Enchance grade is 0 for base and goes up to 20 for PEN.
