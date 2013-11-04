## Zadanie 1

* *zadanie 1a
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

* *zadanie 1b
```sh
db.train.count()
```
wynik - 6034195 obiektów

* *zadanie 1c

* *zadanie 1d

* *zadanie 1e














bash t2 imeunix.bash Train.csv train.csv


mongoimport --db user --collection train --type csv --file Train.csv

real 45m041.787s
user 2m5.984s
sys 8m53.080s

time mongoimport --type csv --collection train --file train,csv --headerline
real 195m027.482s
user 1m40.952s
sys 0m11.820s

mongo //potem konsola
db.train.count()
wynik 4600395 (zabraklo miejsca  na cala baze)
