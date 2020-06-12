# Item-Search Marketplace Clone

Get the details of a marketplace search

**URL** : `/api/marketplace-clone/item-search/:searchText`

**URL Parameters** : `searchText=[integer]` where `searchText` is the text searched for. Use '+' to replicate spaces (ex. 'Caphras Stone' would end up as 'Caphras+Stone'). Is not case sensitive.

**Method** : `GET`

**Auth required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

Returns a list of item/s in the following format

```json
{
  "list": [
    {
      "mainKey": 721003,
      "sumCount": 74281,
      "totalSumCount": 2870000,
      "name": "Caphras Stone",
      "grade": 2
    }
    // Rest of items matching search text will be here
  ],
  "resultCode": 0,
  "resultMsg": ""
}
```

## Notes

- **List -** is the list of items containing the search text.

  - **name -** name of the item
  - **mainKey -** itemId of the item
  - **sumCount -** total items up on market of the item
  - **totalSumCount -** total sales of the item
  - **grade -** is the rarity:
    | Grade | Rarity |
    | ----- | ----- |
    |0 | White |
    |1 | Green |
    |2 | Blue |
    |3 | Yellow |
    |4 | Red |
