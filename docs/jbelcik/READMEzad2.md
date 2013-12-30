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
        "_id" : ObjectId("52c1a5b0ed50916ae247a73e"),
        "Crime ID" : "",
        "Month" : "2013-07",
        "Reported by" : "Avon and Somerset Constabulary",
        "Falls within" : "Avon and Somerset Constabulary",
        "Longitude" : -2.515072,
        "Latitude" : 51.419357,
        "Location" : "On or near Stockwood Hill",
        "LSOA code" : "E01014399",
        "LSOA name" : "Bath and North East Somerset 001A",
        "Crime type" : "Anti-social behaviour",
        "Last outcome category" : "",
        "Context" : ""
}
```
