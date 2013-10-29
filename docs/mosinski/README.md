## MongoDB version

```bash
MongoDB version: 2.5.2
```

## Zadanie 1

* 1a 
#### przygotowanie pliku
  użyłem skryptu wykładowcy [z tąd](https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh)

  ```bash
  $ time bash 2unix.bash Train.csv Train2.csv
  
  real  20m22.142s
  user  10m32.572s
  sys   8m12.063s
  ```
#### import

  ```bash
  $ time mongoimport --type csv -c Train --file ./Train2.csv --headerline

  2013-10-28T23:59:02.068+0100 check 9 6034196
  2013-10-28T23:59:02.068+0100 imported 6034195 objects
 
  real  134m33.441s
  user  85m2.572s
  sys   49m42.13s
  ```  

* 1b

  ```bash
  db.Train.count()
  ```
  Wynik: 6034195 czyli się zgadza

* 1c
  
  wkrótce..

* 1d 
#### przygotowanie
  przygotowałem plik do jsona za pomocą tego skryptu [z tąd](../../scripts/stringTojson.sh)

  ```bash
  $ time bash stringTojson.sh text8.txt text8.json

  real	3m14.336s
  user	0m34.022s
  sys	2m3.248s
  ```
#### import
  ```bash
  $ time mongoimport --db Text --collection text8 --type json --file text8.json
  
  Tue Oct 29 13:40:12.979 check 9 17005207
  Tue Oct 29 13:40:13.823 imported 17005207 objects

  real	  13m17.613s
  user	  2m11.880s
  sys	  2m45.162s
  ```
  Zawsze jeden z dwóch rdzeni przy imporcie działał na 100% ilość wątków wachała się pomiędzy 2-6 wątków.
![htop](../../images/mosinski/screen2.png)
![htop](../../images/mosinski/screen3.png)

#### zliczanie słów
  Ogółem:
  ```js
  db.text8.count()
  17005207
  ```
  Różnych:
  ```js
  db.text8.distinct("word").length
  253854
  ```
