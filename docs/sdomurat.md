### *Szymon Domurat*

----

## Zadanie 1

* 1a

Użyłem komendy do oczyszczenia bazy ze zbędnych pustych ciągów i znaków nowych linni:
```bash
	cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > train2.csv
```
import zrobiłem za pomoca polecenia:
```bash
	mongoimport --type csv -c train --file train2.csv --headerline
```
Import do bazy trwał ok 30 min

* 1b


```bash
	db.train.count();
```

wynik=6034195

* 1d

mongoimport --type csv --db nosql -c text --file text8.txt --fields tekst

++ wykonanie przygotowania pliku zgodnie z poleceniem
```bash
	db.text.count(); - >  17005207
```
```bash
	db.text.distinct("tekst").lenght - > 253854
```	
```bash
	db.text.aggregate([ {$group:{_id:"$tekst", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10} ]);
```

```bash
top 1.
1.the ->1061396
```
1061396/17005207=6%
```bash
top10 
1.the ->1061396
2.of  ->593677
3.and ->416629
4.one ->411764
5.in  ->372201
.
.
.
10.two->192644
```
```bash
db.text.aggregate([ {$group:{_id:"$tekst", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ]);
```
4205965/17005207=25%
```bash
top100
1.the    ->1061396
2.of     ->593677
3.and    ->416629
4.one    ->411764
5.in     ->372201
.
.
.
100.where->123447
```
```bash
db.text.aggregate([ {$group:{_id:"$tekst", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:100}, {$group:{_id: null, count:{$sum:"$count"}}} ]);
```
7998978/17005207=47%
```bash
top1000
1.the    ->1061396
2.of     ->593677
3.and    ->416629
4.one    ->411764
5.in     ->372201
.
.
.
1000.fall->1783
```
```bash
db.text.aggregate([ {$group:{_id:"$tekst", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1000}, {$group:{_id: null, count:{$sum:"$count"}}} ]);
```
114433354/17005207=67%

* 1e

Znalazłem daane na temat wszystkich kraji na świecie z współrzędnymi.
```bash
http://nickrabinowitz.com/projects/temp/countries-hires.zip
```
```bash
mongoimport -c countries --file countries-hires.json 
```
Ilość rekordów w bazie:
```bash
db.countries.count();
238
```
```bash
db.countries.findOne();
```
```bash
        "_id" : ObjectId("52764d95eeb48248eb591773"),
        "type" : "Feature",
        "id" : 0,
        "properties" : {
                "ScaleRank" : 3,
                "LabelRank" : 3,
                "FeatureCla" : "Admin-0 countries",
                "SOVEREIGNT" : "Netherlands",
                "SOV_A3" : "NL1",
                "ADM0_DIF" : 1,
                "LEVEL" : 2,
                "TYPE" : "Country",
                "ADMIN" : "Aruba",
                "ADM0_A3" : "ABW",
                "GEOU_DIF" : 0,
                "GEOUNIT" : "Aruba",
                "GU_A3" : "ABW",
                "SU_DIF" : 0,
                "SUBUNIT" : "Aruba",
                "SU_A3" : "ABW",
                "NAME" : "Aruba",
                "ABBREV" : "Aruba",
                "POSTAL" : "AW",
                "NAME_FORMA" : "",
                "TERR_" : "Neth.",
                "NAME_SORT" : "Aruba",
                "MAP_COLOR" : 9,
                "POP_EST" : 103065,
                "GDP_MD_EST" : 2258,
                "FIPS_10_" : 0,
                "ISO_A2" : "AW",
                "ISO_A3" : "ABW",
                "ISO_N3" : 533
        },
        "geometry" : {
                "type" : "Polygon",
                "coordinates" : [
                        [
                                [
                                        -69.899139,
                                        12.452005
                                ],
                                [
                                        -69.895676,
                                        12.423015
                                ],
                                [
                                        -69.942159,
                                        12.438518
                                ],
                                [
                                        -70.004145,
                                        12.500503
                                ],
                                [
                                        -70.066131,
                                        12.546986
                                ],
                                [
                                        -70.050861,
                                        12.597087
                                ],
                                [
                                        -70.035125,
                                        12.614114
                                ],
                                [
                                        -69.973139,
                                        12.567631
                                ],
                                [
                                        -69.911799,
                                        12.480479
                                ],
                                [
                                        -69.899139,
                                        12.452005
                                ]
                        ]
                ]
        }
}
```
Utworzenie indeksów:
```bash
db.countries.ensureIndex({"geometry" : "2dsphere"})
```
```bash
db.countries.stats();
{
        "ns" : "test.countries",
        "count" : 238,
        "size" : 3474656,
        "avgObjSize" : 14599.394957983193,
        "storageSize" : 6533120,
        "numExtents" : 3,
        "nindexes" : 1,
        "lastExtentSize" : 5931008,
        "paddingFactor" : 1,
        "systemFlags" : 1,
        "userFlags" : 0,
        "totalIndexSize" : 8176,
        "indexSizes" : {
                "_id_" : 8176
        },
        "ok" : 1
}
```