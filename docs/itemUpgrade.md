# Custom Search

Get a list of items that are possible upgrades with the calculated upgrade cost per stat gain. Use that to choose your next item to upgrade.

**URL** : `/api/item-upgrade?region=YOURREGION`

**URL Queries** : `region` where `region` is either na or eu (case sensitive, must be lowercase). This is required.

**Method** : `GET`

**Data constraints**

```json
{
  "character": {
      "name": Character class
  },
  "mainHand": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level (16-20)
  },
  "offhand": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "awakening": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "gloves": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "helm": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "armor": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "boots": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (16-20)
  },
  "ring": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (1-5)
  },
  "necklace": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (1-5)
  },
  "earring": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (1-5)
  },
  "belt": {
      "name": See notes for valid entries,
      "enhLevel": Enhance Level Enhance Level (1-5)
  },
}
```

**Data example**

```json
{
  "characterClass": {
    "name": "sorceress"
  },
  "mainHand": {
    "name": "Kzarka",
    "enhLevel": 20
  },
  "offhand": {
    "name": "Kutum",
    "enhLevel": 18
  },
  "awakening": {
    "name": "Dandelion",
    "enhLevel": 18
  },
  "gloves": {
    "name": "Bheg's",
    "enhLevel": 18
  },
  "helm": {
    "name": "Griffon's",
    "enhLevel": 18
  },
  "armor": {
    "name": "Dim",
    "enhLevel": 18
  },
  "boots": {
    "name": "Urugon's",
    "enhLevel": 18
  },
  "ring": {
    "name": "Ring of Crescent Guardian",
    "enhLevel": 3
  },
  "earring": {
    "name": "Tungrad Earring",
    "enhLevel": 3
  },
  "necklace": {
    "name": "Ogre Ring",
    "enhLevel": 3
  },
  "belt": {
    "name": "Basilisk's Belt",
    "enhLevel": 3
  }
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

Returns an array of items in the following format.

```json
{
  "name": "Blackstar Amulet",
  "id": 715005,
  "enhLevel": 19,
  "price": 16400000000,
  "type": "mainHand",
  "stats": {
    "ap": 125,
    "dp": 0
  },
  "perStatCost": {
    "ap": 16.4, // Cost in billions for 1 ap
    "dp": 0, // Cost in billions for 1 dp
    "total": 16.4 // Cost in billions for 1 ap or dp
  }
}
```

## Notes

| Entry          | Input Type | Valid Inputs                                                                                                                                                               |
| -------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| characterClass | string     | dark knight, warrior, valkyrie, guardian, ranger, witch, wizard, sorceress, beserker, tamer, musa, maehwa, ninja, kunoichi, striker, mystic, lahn, archer, shai, hashashin |
| mainHand       | string     | Kzarka, Offin, Blackstar                                                                                                                                                   |
| offhand        | string     | Kutum, Nouver                                                                                                                                                              |
| awakening      | string     | Dandelion, Dragon                                                                                                                                                          |
| gloves         | string     | Bheg's, Leebur's                                                                                                                                                           |
| helm           | string     | Giath's, Griffon's                                                                                                                                                         |
| armor          | string     | Dim, Red, Blackstar                                                                                                                                                        |
| boots          | string     | Urugon's, Muskan's                                                                                                                                                         |
| ring           | string     | Ring of Crescent Guardian, Tungrad Ring, Ring of Cadry Guardian, Eye of the Ruins Ring                                                                                     |
| necklace       | string     | Ogre Ring, Deboreka Necklace, Laytenn's Power Stone, Serap's Necklace, Sicil's Necklace, Tungrad Necklace                                                                  |
| earring        | string     | Tungrad Earring, Dawn Earring, Ethereal Earrings, Black Distortion Earring, Narc Ear Accessory                                                                             |
| belt           | string     | Tungrad Belt, Valtarra Eclipsed Belt, Basilisk's Belt, Centaurus Belt, Orkinrad's Belt                                                                                     |

- Enhance level for weapons and armor will be:

| level | input |
| ----- | ----- |
| PRI   | 16    |
| DUO   | 17    |
| TRI   | 18    |
| TET   | 19    |
| PEN   | 20    |

- Enhance level for accessories will be:

| level | input |
| ----- | ----- |
| PRI   | 1     |
| DUO   | 2     |
| TRI   | 3     |
| TET   | 4     |
| PEN   | 5     |

- I calculated the upgrade formula (cost of upgrade / difference in stat ) the way that seemed the best to me. If there is a better please let me know.
