### *Krzysztof Skowroński*

----

### Konfiguracja sprzętowa

4 rdzeniowy procesor o taktowaniu 2.4 Ghz

Intel(R) Core(TM)2 Quad CPU Q6600  @ 2.40GHz
4 GB pamięci RAM

Wersja mongo
```
$ mongo --version
MongoDB shell version: 2.4.7
```

Do liczenia czasu w systemie windows użyłem [timecmd.bat](/scripts/kskowronski/timecmd.bat)

### Zadanie 1a

Plik Train.csv przygotowałem przy pomocy 2unix.sh

**Polecenie importu**
```
mongoimport -d mydb -c things --type csv --file Train1.cvs --headerline
```
**Czas importu do MongoDB**

Ok. 20min

### Zadanie 1b

Ilość zaimportowanych rekordów
```
> db.things.count()
6034195

```

### Zadanie 1c

**Zamiana stringa "Tags" na tablice i zliczanie tagów** 

Do zmiany formatu danych i liczeniu tagów napisałem program [mongo.js](/scripts/kskowronski/mongo.js) w javascript na node.js przy użyciu drivera mongodb.

Podczas pobierania rekordów z bazy procesor był obciążony w 50% (na wszystkich rdzeniach) a przy zapisywaniu zmian do bazy oscylował w okolicach 15% (na wszystkich rdzeniach)

**Czas wykonania**

30 minut

**Wynik**
```
	Updated: 6034195
       Tags: 17409994
Unique Tags: 42048
command took 0:30:32.00 (1832.00s total)
```

### Zadanie 1d

**Przygotowanie danych**

Dane przygotowałem tak jak było zasugerowane przy opisie zadania.

**Polecenie importujące bazę danych text8**

```
mongoimport -d book -c words --type csv -f word text8.txt
```

**Czas wykonania**

28 minut


**10, 100, 100 najczestszych słów**
 
Top 1:
Ilość:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 1 })
```
Procent:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 1 }).result[0].count / db.words.count() * 100
6.241594118789616
```

Top 10:
Ilość:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 10 })
```
Procent:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 10 }).result[0].count / db.words.count() * 100
24.733394894869555
```

Top 100:
Ilość:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 100 })

```
Procent:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 100 }).result[0].count / db.words.count() * 100
47.03840417820259
```

Top 1000:
Ilość:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 1000 })
```
Procent:
```
db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 1000 }).result[0].count / db.words.count() * 100
67.23443001899359
```

Ilosc wszystkich slow

```
> db.words.count()
17005207
```

Ilosc roznych slow

```
> db.words.distinct("word").length
253854
```


### Zadanie 1e
Comming soon!!
