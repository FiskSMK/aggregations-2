### *Kamil Zdunek*

----

### *Konfiguracja sprzętu*

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/0_dane_tech.png)

## Zadanie 1
### a) Import danych z pliku CSV do bazy danych MongoDB

Modyfikacja pliku CSV skryptem prowadzącego zajęcia (2unix.sh), z powodu łamania się linii:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/2_przesiew.png)

Po modyfikacji:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/3_przesiew_end.png)

Import za pomocą:
```
time mongoimport --type csv -c Train --file ./Train2.csv --headerline
```
Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/4_import_end.png)

### b) Zliczanie ilośći zaimportowanych rekordów
```
db.zadanie.count();
```

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/5_potw_count.png)

###Ciąg dalszy nastąpi