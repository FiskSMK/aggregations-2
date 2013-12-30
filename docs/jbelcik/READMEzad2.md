# *Jakub Bełcik*

* [Dane techniczne](#dane-techniczne)

---

## Dane Techniczne

Procesor:
	AMD Phenom II x4 955 3.2GHz

RAM:
	Kingston HyperX 2x2GB 1333MHz DDR3

Dysk Twardy:
	Samsung Spin Point F1 320GB SATA II, NCQ, 16MB

System operacyjny:
	Windows 7 Professional x64

Środowisko:
	Cygwin 1.7.25 x64

Baza Danych:
	MongoDB 2.4.7 x64

---

```sh
$ time mongoimport -d dataBase -c streetLevelCrime --type csv --file data.police.uk-cps-2013.07=2013.10-street.csv --headerline
connected to: 127.0.0.1
check 9 1004953
imported 1004952 objects

real    0m56.013s
user    0m0.000s
sys     0m0.031s
```

Średnio ~17941 objektów na sekundę

Przykładowy rekord:

```json
> db.streetLevelCrime.findOne()
{
        "_id" : ObjectId("52c1b350ed50916ae256fcd6"),
        "crime_id" : "",
        "month" : "2013-07",
        "reported_by" : "Avon and Somerset Constabulary",
        "falls_within" : "Avon and Somerset Constabulary",
        "longitude" : -2.515072,
        "latitude" : 51.419357,
        "location" : "On or near Stockwood Hill",
        "lsoa_code" : "E01014399",
        "lsoa_name" : "Bath and North East Somerset 001A",
        "crime_type" : "Anti-social behaviour",
        "last_outcome_category" : "",
        "context" : ""
}
```

```js
> db.streetLevelCrime.aggregate(
> 	{ $group: {
> 		_id: "$reported_by",
> 		total: { $sum: 1 }
> 	} },
> 	{ $sort: { total: -1 } }
> )
{
        "result" : [
                {
                        "_id" : "Metropolitan Police",
                        "total" : 329467
                },
                {
                        "_id" : "Greater Manchester Police",
                        "total" : 112624
                },
                {
                        "_id" : "West Yorkshire Police",
                        "total" : 89648
                },
                {
                        "_id" : "West Midlands Police",
                        "total" : 87999
                },
                {
                        "_id" : "Lancashire Constabulary",
                        "total" : 65732
                },
                {
                        "_id" : "South Yorkshire",
                        "total" : 62809
                },
                {
                        "_id" : "Hampshire Constabulary",
                        "total" : 60652
                },
                {
                        "_id" : "Avon and Somerset Constabulary",
                        "total" : 59222
                },
                {
                        "_id" : "Thames Valley Police",
                        "total" : 58964
                },
                {
                        "_id" : "Police Service of Northern Ireland",
                        "total" : 56712
                },
                {
                        "_id" : "Lincolnshire Police",
                        "total" : 21123
                }
        ],
        "ok" : 1
}
```

![1](../../images/jbelcik/wykres1.jpg)

```js
> db.streetLevelCrime.aggregate(
>	{ $group: {
>		_id: "$lsoa_name",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 6 },
>	{ $skip: 1 }
> )
{
        "result" : [
                {
                        "_id" : "Leeds 111B",
                        "total" : 2321
                },
                {
                        "_id" : "Westminster 018A",
                        "total" : 2231
                },
                {
                        "_id" : "Westminster 013E",
                        "total" : 2035
                },
                {
                        "_id" : "Westminster 013B",
                        "total" : 1788
                },
                {
                        "_id" : "Manchester 054C",
                        "total" : 1575
                }
        ],
        "ok" : 1
}

> db.streetLevelCrime.aggregate(
>	{ $match : { lsoa_name : "Leeds 111B" } },
>	{ $group: {
>		_id: "$last_outcome_category",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 4 }
> )
{
        "result" : [
                {
                        "_id" : "No further action at this time",
                        "total" : 1175
                },
                {
                        "_id" : "",
                        "total" : 555
                },
                {
                        "_id" : "Under investigation",
                        "total" : 179
                },
                {
                        "_id" : "Awaiting court outcome",
                        "total" : 91
                }
        ],
        "ok" : 1
}

> db.streetLevelCrime.aggregate(
>	{ $match : { lsoa_name : "Westminster 018A" } },
>	{ $group: {
>		_id: "$last_outcome_category",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 4 }
> )
{
        "result" : [
                {
                        "_id" : "Under investigation",
                        "total" : 866
                },
                {
                        "_id" : "No further action at this time",
                        "total" : 684
                },
                {
                        "_id" : "",
                        "total" : 311
                },
                {
                        "_id" : "Offender given a caution",
                        "total" : 174
                }
        ],
        "ok" : 1
}

> db.streetLevelCrime.aggregate(
>	{ $match : { lsoa_name : "Westminster 013E" } },
>	{ $group: {
>		_id: "$last_outcome_category",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 4 }
> )
{
        "result" : [
                {
                        "_id" : "Under investigation",
                        "total" : 913
                },
                {
                        "_id" : "No further action at this time",
                        "total" : 668
                },
                {
                        "_id" : "",
                        "total" : 252
                },
                {
                        "_id" : "Offender given a caution",
                        "total" : 66
                }
        ],
        "ok" : 1
}

> db.streetLevelCrime.aggregate(
>	{ $match : { lsoa_name : "Westminster 013B" } },
>	{ $group: {
>		_id: "$last_outcome_category",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 4 }
> )
{
        "result" : [
                {
                        "_id" : "Under investigation",
                        "total" : 737
                },
                {
                        "_id" : "No further action at this time",
                        "total" : 522
                },
                {
                        "_id" : "",
                        "total" : 212
                },
                {
                        "_id" : "Offender given a caution",
                        "total" : 128
                }
        ],
        "ok" : 1
}

> db.streetLevelCrime.aggregate(
>	{ $match : { lsoa_name : "Manchester 054C" } },
>	{ $group: {
>		_id: "$last_outcome_category",
>		total: { $sum: 1 },
>	} },
>	{ $sort: { total: -1 } },
>	{ $limit: 4 }
> )
{
        "result" : [
                {
                        "_id" : "No further action at this time",
                        "total" : 735
                },
                {
                        "_id" : "",
                        "total" : 407
                },
                {
                        "_id" : "Under investigation",
                        "total" : 108
                },
                {
                        "_id" : "Awaiting court outcome",
                        "total" : 105
                }
        ],
        "ok" : 1
}
```

![2](../../images/jbelcik/wykres2.jpg)