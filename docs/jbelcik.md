### *Jakub Bełcik*

----

### Dane Techniczne

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

### Zadanie 1a
```
Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy:

    MongoDB
    PostgreSQL – opcjonalnie dla znających fanów SQL
```

```sh
$ time ./2unix.sh Train.csv trainProper.csv

real    11m30.359s
user    2m47.605s
sys     1m43.721s
```

```sh
$ time mongoimport -d dataBase -c train --type csv --file trainProper.csv --headerline
```

real    15m50.589s
user    0m0.000s
sys     0m0.031s
```

---

### Zadanie 1b
```
Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).
```

```sh
$ mongo

MongoDB shell version: 2.4.7
connecting to: dataBase

> db.train.count()

6034195
```