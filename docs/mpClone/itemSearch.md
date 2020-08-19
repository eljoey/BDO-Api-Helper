# Item-Search Marketplace Clone

Get the details of a marketplace search

**URL** : `/marketplace-clone/item-search/:searchText?region=YOURREGION`

**URL Parameters** : `searchText=[integer]` where `searchText` is the text searched for. Use '+' to replicate spaces (ex. 'Caphras Stone' would end up as 'Caphras+Stone'). Is not case sensitive.

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns json in the following format.

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
  ],
  "resultCode": 0,
  "resultMsg": ""
}
```

## Notes

- **List -** is the list of items containing the search text.

  - **name -** name of the item.
  - **mainKey -** itemId of the item.
  - **sumCount -** total items up on market of the item.
  - **totalSumCount -** average price of base item.
  - **grade -** is the rarity:
    | Grade | Rarity |
    | ----- | ----- |
    |0 | White |
    |1 | Green |
    |2 | Blue |
    |3 | Yellow |
    |4 | Red |

    - I have no idea what resultCode and resultMsg are for.
