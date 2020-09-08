# Kutum or Nouver

Determine which offhand to use based of your current gear level.

**URL** : `api/kutum-or-nouver?baseAp=APWITHNOOFFHAND&kutumLvl=ENHANCELEVEL&kutumCaphra=CAPHRALEVEL&nouverLvl=ENHANCELEVEL&nouverCaphra=CAPHRALEVEL&region=REGION`

**URL Queries** :

- `baseAp` where `baseAp` is your sheet ap with no offhand equipped. This is `required`.
- `kutumLvl` where `kutumLvl` is one of `tri, tet, pen`. This is `required`.
- `kutumCaphra` where `kutumCaphra` is the current caphras level of your Kutum. This is `optional`
- `nouverLvl` where `nouverLvl` is one of `tri, tet, pen`. This is `required`.
- `nouverCaphra` where `nouverCaphra` is the current caphras level of your Nouver. This is `optional`

**Method** : `GET`

## Success Response

**Code** : `200 OK`

**Content examples**

Returns an object in the following format.

```json
{
  "bestOffhand": "Kutum",
  "effectiveApDiff": 3
}
```

## Notes

- If an offhand does not have any caphras level you can skip using the query.
- If you have a low or excessive ammount of AP a set response of Kutum will be given as its your best option by far.
