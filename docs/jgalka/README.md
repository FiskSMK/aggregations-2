## Zadanie 1

* zadanie 1a

wstępne "oczyszczenie" pliku wykonałem korzystając ze skryptu [2unix.sh] (/scripts/wbzyl/2unix.sh)

```sh
$ time bash 2unix.sh Train.csv train.csv

real 	45m041.787s
user 	2m5.984s
sys 	8m53.080s
```
import pliku do bazy
```sh
$ time mongoimport --type csv --collection train --file train.csv --headerline

real 	195m027.482s
user 	1m40.952s
sys 	0m11.820s
```
zaimportowało 6034195 obiektów

* zadanie 1b

polecenie wprowadzone w konsoli mongoDB

```sh
db.train.count()
```
wynik - 6034195 obiektów

* zadanie 1c

* zadanie 1d

* zadanie 1e
