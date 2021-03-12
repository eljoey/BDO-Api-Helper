# BDO API HELPER

Api wrapper to grab marketplace data from BDO's NA marketplace

## Updates

DATE HERE - I've changed the api to use a db and update the prices every 30 minutes.

## Routes

- Base Url `https://bdo-api-helper.herokuapp.com`

## Prices

Grabs the current marketplace info for desired items. Routes are cached for 5min but if you are the first to request in the last 5 minutes then it will take a few seconds to get the info and respond.

- [Alchemy](docs/prices/alchemy.md) `GET /api/prices/alchemy`
- [Cooking](docs/prices/cooking.md) `GET /api/prices/cooking`
- [DriedFish](docs/prices/fish.md) `GET /api/prices/fish`

## Custom Searches

### Single Search

Search for the data on the desired item id.

- [Item-Search](docs/itemSearch.md) `GET /api/item-search`

### Bulk Search

Allows you to create a custom search for items if you have all the item ids. Response time will grow with increased items requested.

- [Search](docs/search.md) `GET /api/search`

## Caphras Calculator

Calculate the current cost of caphras enhancing for an item.

- [Caphras-Calc](docs/caphrasCalc.md) `GET /api/caphras-calc`

## Item Upgrade Path

Get a list of items with upgrade cost per stat increase to help choosing which item to upgrade next.

- [Item-Upgrade](docs/itemUpgrade.md) `POST /api/item-upgrade`

## Kutum Or Nouver

Determine which offhand is best at your ap level.

- [Kutum-Or-Nouver](docs/kutumOrNouver.md) `GET /api/kutum-or-nouver`

## Marketplace Clone

Mocks the api calls for the bdo marketplace. Best to use this if you want to clone the marketplace on a frontend.

- [Item List](docs/mpClone/itemList.md) `GET /marketplace-clone/item-list`
- [Item Info](docs/mpClone/itemInfo.md) `GET /marketplace-clone/item-info`
- [Item Pricing](docs/mpClone/itemPricing.md) `GET /marketplace-clone/item-pricing`
- [Item Search](docs/mpClone/itemSearch.md) `GET /marketplace-clone/item-search`

## Warning

You must choose a region for all endpoints except kutum-or-nouver. Add `?region=YOURREGIONHERE` `na` for North America and `eu` for Europe region at the end of the call.

ex. `https://bdo-api-helper.herokuapp.com/api/prices/cooking?region=na` will return a list of the prices for the cooking mat prices for the North American server

## License

[MIT](https://choosealicense.com/licenses/mit/)
