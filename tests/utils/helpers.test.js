const helpers = require('../../utils/helpers');
const addStatsInput = require('./addStats_input.json');
const addStatsOutput = require('./addStats_output.json');
const calcCostCurGear = require('./calcCostPerStat_CurrentGear.json');
const calcCostPotGear = require('./calcCostPerStat_PotentialGear.json');
const calcCostResult = require('./calcCostResult.json');
const fs = require('fs');

describe('Helpers utility check', () => {
    test('caphrasNeeded returns correct ammount of caphras neeeded', () => {
        const result = helpers.caphrasNeeded('BossMH', 'pen', 0, 10);

        expect(result).toBe(8895);
    });
    test('getStats should return correct stats', () => {
        const result = helpers.getStats('BossMH', 'pen', 0, 10);
        expect(result).toEqual({
            "accuracy": "7 (+7)",
            "ap": "5 (+5)",
        });
    });
    test('addStats should return correctly', () => {
        const result = helpers.addStats(addStatsInput);

        expect(result).toEqual(addStatsOutput);
    });
    test('calcCostPerStat should return correctly', () => {
        const result = helpers.calcCostPerStat(calcCostCurGear, calcCostPotGear);

        expect(result).toEqual(calcCostResult);
    });
    test('addCurrentGearStats shoudl return correctly', () => {
        const input = {
            "armor": {
                "name": "Dim",
                "enhLevel": 19
            },
            "awakening": {
                "name": "Dandelion",
                "enhLevel": 19
            },
            "belt": {
                "name": "Basilisk's Belt",
                "enhLevel": 5
            },
            "boots": {
                "name": "Urugon's",
                "enhLevel": 19
            },
            "characterClass": {
                "name": "dark knight"
            },
            "earring": {
                "name": "Tungrad Earring",
                "enhLevel": 5
            },
            "gloves": {
                "name": "Bheg's",
                "enhLevel": 16
            },
            "helm": {
                "name": "Griffon's",
                "enhLevel": 19
            },
            "mainHand": {
                "name": "Kzarka",
                "enhLevel": 19
            },
            "necklace": {
                "name": "Ogre Ring",
                "enhLevel": 5
            },
            "offhand": {
                "name": "Kutum",
                "enhLevel": 19
            },
            "ring": {
                "name": "Ring of Crescent Guardian",
                "enhLevel": 5
            }
        };
        const output = {
            "armor": {
                "name": "Dim",
                "enhLevel": 19,
                "stats": {
                    "ap": 0,
                    "dp": 84
                }
            },
            "awakening": {
                "name": "Dandelion",
                "enhLevel": 19,
                "stats": {
                    "ap": 118,
                    "dp": 0
                }
            },
            "belt": {
                "name": "Basilisk's Belt",
                "enhLevel": 5,
                "stats": {
                    "ap": 20,
                    "dp": 0
                }
            },
            "boots": {
                "name": "Urugon's",
                "enhLevel": 19,
                "stats": {
                    "ap": 0,
                    "dp": 74
                }
            },
            "earring": {
                "name": "Tungrad Earring",
                "enhLevel": 5,
                "stats": {
                    "ap": 17,
                    "dp": 0
                }
            },
            "gloves": {
                "name": "Bheg's",
                "enhLevel": 16,
                "stats": {
                    "ap": 0,
                    "dp": 37
                }
            },
            "helm": {
                "name": "Griffon's",
                "enhLevel": 19,
                "stats": {
                    "ap": 0,
                    "dp": 75
                }
            },
            "mainHand": {
                "name": "Kzarka",
                "enhLevel": 19,
                "stats": {
                    "ap": 116,
                    "dp": 0
                }
            },
            "necklace": {
                "name": "Ogre Ring",
                "enhLevel": 5,
                "stats": {
                    "ap": 35,
                    "dp": 0
                }
            },
            "offhand": {
                "name": "Kutum",
                "enhLevel": 19,
                "stats": {
                    "ap": 30,
                    "dp": 17
                }
            },
            "ring": {
                "name": "Ring of Crescent Guardian",
                "enhLevel": 5,
                "stats": {
                    "ap": 20,
                    "dp": 0
                }
            }
        };

        const result = helpers.addCurrentGearStats(input);

        expect(result).toEqual(output);
    });

    test('getEffectiveAp should return correctly', () => {
        const result = helpers.getEffectiveAp('kutum', 'pen', 0, 260);

        expect(result).toBe(521);
    });

    test('getCharacterGearPossibilities should return correctly', () => {
        const result = helpers.getCharacterGearPossibilities('dark knight');
        const output = [11360, 11436, 715016, 10740, 10738, 14817, 702513, 11015, 11102, 11101, 11013, 11017, 11014, 719902, 11016, 11103, 12031, 12061, 12032, 12060, 12068, 11828, 11855, 11856, 11853, 11834, 11607, 11653, 11630, 11628, 11625, 11629, 12237, 12236, 12230, 12229, 12251, 12257];

        expect(result).toEqual(output);
    });


});
