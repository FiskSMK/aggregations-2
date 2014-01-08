### *Bartłomiej Pietraszuk*

----

### Konfiguracja

```
System operacyjny: Windows 7 Professional 64bit
Procesor: Intel(R) Core(TM) i7-4770 CPU @ 3.40GHz
RAM: 16 GB
Dysk: Samsung SSD 840 EVO 250G SCSI Disk Service
Środowisko cygwin
```

Wersja mongo
```
$ mongo --version
MongoDB shell version: 2.4.8
```

### Zadanie 1a

Plik Train.csv zawiera znaki nowych linii wewnątrz komórek.

Aby zaimportować plik postanowiłem usunąć znaki nowych linii występujące wewnątrz komórek. Wykorzystałem do tego 2unix.sh

```
sh 2unux.sh Train.csv Train2.csv
```
real 1m21.344s
user 035.691s
sys 0m30.496s

**Import**
```
time ./mongoimport.exe -c train --type csv --headerline --file Trains2.csv
```
real 5m2.579s
user 0m0.000s
sys 0m0.016s

Rozmiar bazy danych przed importem: 80 MB
Rozmiar bazy danych po imporcie: 13 GB

Zużycie pamięci RAM przed importem: 2,5GB
Zużycie pamięci RAM w czasie importu: 11 GB

### Zadanie 1b

Zliczanie ilości zaimportowanych rekordów
```
> db.train.count()
6034195
> 
```

### Zadanie 1c

Do zamiany posłużyła mi prosta aplikacja napisana w języku JAVA, z odpowiednim sterownikiem do mongo.

[Test.java](../scripts/bpietraszuk/Test.java)

Czas wykonania: 2m
 
### Zadanie 1d

**Polecenie importujące bazę danych text8**

```
time ./mongoimport.exe --type csv --collection words --fields word --file text8.txt
```

real 3m21.664s
user 0m0.015s
sys 0m0.000s


**Top 1**
Najczęściej występującym słowem było słowo *the*; pojawiło się 1061396 razy.
Stanowi ~16.24% całości. 
```
db.words.aggregate(
        { $group: { _id: "$word", count: { $sum: 1 } } } , 
        { $sort: { count: -1 } }, 
        { $limit: 1 })
```
**Top 10**

![graph](../images/bpietraszuk/top10.png)

```
db.words.aggregate(
        { $group: { _id: "$word", count: { $sum: 1 } } } , 
        { $sort: { count: -1 } }, 
        { $limit: 10 })
```

**Top 100**
```
db.words.aggregate(
        { $group: { _id: "$word", count: { $sum: 1 } } } , 
        { $sort: { count: -1 } }, 
        { $limit: 100 })
```

**Top 1000**
Miejsce: 67% danych
```
db.words.aggregate(
        { $group: { _id: "$word", count: { $sum: 1 } } } , 
        { $sort: { count: -1 } }, 
        { $limit: 1000 })
```

**Wszystkie slowa**
```
> db.words.count()
17005207
```

**Różne słowa**
```
> db.words.distinct("word").length
253854
```
