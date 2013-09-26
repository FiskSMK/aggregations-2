# GeoBytes: miasta i państwa

Ze strony [GeoBytes](http://www.geobytes.com/freeservices.htm) pobrano
plik *GeoWorldMap.zip*. Pliki *cities.txt* i *Countries.txt*
po przekodowaniu na UTF-8 zapisano w bazie MongoDB.

Następnie dane zostały pobrane z bazy za pomocą programu *mongoexport*.
Pobrane dane zapisano w plikach: [countries.json](/data/json/countries.json)
i [cities.json](/data/json/cities.json).

Przykładowy rekord z kolekcji *countries*:

```json
{
  "_id": 197,
  "title": "Poland",
  "population": 38633912,
  "currency_code": "PLN",
  "currency": "Zloty",
  "nationality_plural": "Poles",
  "nationality_singular": "Polish",
  "map_reference": "Europe ",
  "country": "Poland",
  "fips104": "PL",
  "iso2": "PL",
  "iso3": "POL",
  "ison": 616,
  "internet": "PL",
  "capital": "Warsaw "
}
```

Przykładowy rekord z kolekcji *cities*:

```json
{
  "country_id": 197,
  "loc": [ 18.667, 54.35 ],
  "code": "GDAN",
  "time_zone": "+01:00",
  "city": "Gdansk"
}
```

**TODO:** Niektóre napisy zawierają niepotrzebne spacje, np.
`"Warsaw "`, `"Europe "`.
