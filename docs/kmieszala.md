# *Konrad Mieszała*

Procesor na jakim pracuje :
model name      : Intel(R) Core(TM) i3 CPU       M 350  @ 2.27GHz
###Zadanie 1a)
Pozbycie się białych znaków:
```sh
time cat Train.csv | replace "\n" " " | replace "\r" "\n" > TrainPrzerobiony.csv
```
Czas:
```
real    7m40.809s
user    3m17.495s
sys     0m57.287s
```
Import:
```sh
mongoimport --type csv -c Train --file TrainPrzerobiony.csv --headerline
```
```
real    62m22.013s
user    5m20.328s
sys     1m12.556s
```
![](../images/kmieszala/screan.JPG)
###Zadanie 1b)
Zliczenie zaimportowanych rekordów.
```sh
> db.Train.count()
6034195
```
