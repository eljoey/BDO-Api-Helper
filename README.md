# BDO API HELPER

Api wrapper to grab marketplace data from BDO's NA marketplace

## Routes

- Base Url `https://bdo-api-helper.herokuapp.com`

### Prices

Grabs the current marketplace info for desired items. Routes are cached for 5min but if you are the first to request in the last 5 minutes then it will take a few seconds to get the info and respond.

- [Alchemy](docs/prices/alchemy.md) `GET /api/prices/alchemy`
- [Cooking](docs/prices/cooking.md) `GET /api/prices/cooking`
- [DriedFish](docs/prices/fish.md) `GET /api/prices/fish`

### Custom Search

Allows you to create a custom search for items if you have all the item ids. Response time will grow with increased items requested.

- [Search](docs/search.md) `GET /api/search`

### Marketplace Clone

Mocks the api calls for the bdo marketplace. Best to use this if you want to clone the marketplace on a frontend.

- [Item List](docs/mpClone/itemList.md) `GET /marketplace-clone/item-list`
- [Item Info](docs/mpClone/itemInfo.md) `GET /marketplace-clone/item-info`
- [Item Pricing](docs/mpClone/itemPricing.md) `GET /marketplace-clone/item-pricing`
- [Item Search](docs/mpClone/itemSearch.md) `GET /marketplace-clone/item-search`

## Misc

If you would like to use this for EU you will need an account that you are willing to use. Follow these steps to configure it.

- Go to bdo market site [here](https://market.blackdesertonline.com/) choose your region and log in.

  - Hit F12 and go to the network tab.
  - On the main page click on any item and hit 'see details'
  - In the network tab you will see 'GetItemSellBuyInfo'. Click on it.
    - In the request headers section there will be a line that says 'Cookie:' copy and paste that into notepad.
    - In the form data section there will be a line that says '\_RequestVerificationToken:' copy and paste that into notepad on a new line.

- Clone this project
  `git checkout https://github.com/eljoey/BDO-Api-Helper.git`

- In the project directory create a file called '.env'

  - Open the .env file and type each of the following on a new line.
    - `PORT=3000` (Can change this if it conflicts with anything)
    - `BDO_COOKIE=` and paste the info from 'Cookie:'
    - `BDO_TOKEN=` and paste the info from '\_RequestVerificationToken:'

- Then to run on your own.
  - `npm install`
  - `npm run dev` and then your base url will be `localhost:3000` or whatever you set the port to be

## License

[MIT](https://choosealicense.com/licenses/mit/)
