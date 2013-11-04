**** Bartek Winsławski

Zadanie 1a.


Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy MongoDB.
Wcześniej jednak należy przygotować plik Train.csv poleceniem:

```sh
cat Train.csv | replace "\n" " " | replace "\r" "\n" > Train2.csv
```
Czas trwania 7 min


Import:

```sh
mongoimport --type csv -c Train --file Train2.csv --headerline
```
Czas trwania 
