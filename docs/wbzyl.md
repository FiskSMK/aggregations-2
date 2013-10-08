## Zadanie 1

### *Włodzimierz Bzyl*

Plik [places.json](/data/wbzyl/places.json) zawiera dane
w następującym formacie:

```json
{
  "_id": "oakland",
  "loc": {
    "type":"Point",
    "coordinates": [-122.270833,37.804444]
  }
}
```

Dane te zaimportowano do bazy MongoDB o nazwie *test* i kolekcji *places*.
za pomocą programu *mongoimport*:

```sh
mongoimport --drop --collection imieniny places.json
```

Link do skryptu [facebook.js](/scripts/wbzyl/facebook.js) – przykład
pokazujący jak to zrobić.


### Przykładowe agregacje

Opisy wszystkich agregacji.

----

## Zadanie 2

Rozwiązanie + wizualizacja wyników (obrazek) lub tabelka.
