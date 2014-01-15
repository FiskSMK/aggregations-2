### *Detlaf Krzysztof*
#### Zadanie II
#### Tematyka: Społeczność (bilans, płeć, wiek, itp.). 
###### (Oczywiście dane mogą się minimalnie zmienić).
----
###Parametry komputera:

####Intel Core i3-2310M @ 2.10 GHz, 4 GB RAM

Wersja mongo
```
$ mongo --version
MongoDB shell version: 2.4.8
```
----


###Przygotowanie danych:

Do wygenerowania danych użyłem serwisu http://www.json-generator.com/.

Przykład rekordu
-----------
``` json
{
        "name": "Kelli Figueroa",
        "gender": "female",
        "balance": "$1,765.00",
        "age": 23,
        "weight": 83,
        "size": 135
}
```

###Import danych dla MongoDB:

Niestety mam kilka plików, które trzeba było importować jeden po drugim.
```
mongoimport --collection nazwa_kolekcji --type json --file plik.json --jsonArray
```
--jsonArray powoduje, że mongoimport rozpoznaje konstrukcję jsona
```
mongoimport --collection human --type json --file 1.json --jsonArray
```

