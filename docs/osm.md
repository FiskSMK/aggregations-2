# Open Street Map data dla Polski

Dane pobrano ze strony
[Overpass API](http://overpass-api.de):

```sh
wget 'http://overpass-api.de/api/interpreter?data=[out:json];node(49,14,55,24)[amenity];out;' -O poland.json
```

Następnie dane zostały oczyszczone i przekształcone za pomocą programu
[jq](http://stedolan.github.io/jq/),
tak aby można było łatwo je zaimportować do MongoDB
(jeden JSON w jednym wierszu)
oraz dodano pole *location*:

```sh
cat poland.json | \
jq -c '.elements[] | {_id: .id, tags, location: {type: "Point", coordinates: [.lon, .lat]}}' > \
osm-data_poland-amenities.json
```

Przekształcone dane zostały zaimportowane do kolekcji *poland*
w bazie *test*:

```sh
mongoimport --drop -c poland < osm-data_poland-amenities.json
```

Przykładowy dokument z kolekcji *poland* (108240 dokumentów):

```json
{
  "_id": 1115754616
  "location": {
    "coordinates": [ 18.184946, 50.6736808 ],
    "type": "Point"
  },
  "tags": {
    "operator": "Orlen",
    "opening_hours": "24/7",
    "name": "Orlen",
    "amenity": "fuel"
  }
}
```

Dane są dostępne na maszynie wirtualnej:

```sh
mongo -u student -p sesja2013 153.19.1.202/test
```


## Lista wszystkich kluczy występujących w *tags*

MapReduce:

```js
m = function() { Object.keys(this.tags).forEach(function(key) { emit(key, 1); }); }
r = function(key, values) { return Array.sum(values); }

db.osm.drop()
db.poland.mapReduce(m, r, {out: "osm"})
```

Sprawdzamy, które klucze występują najczęściej:

```js
db.osm.find().sort({value: -1})
```

Ciekawsze klucze:

```
name:    47_756
cuisine:  4_280
parking:  3_108
atm:      1_681
fuel: fuel:ethanol, fuel:lpg, … : ok. 1_000
```
