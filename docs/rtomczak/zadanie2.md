## MongoDB version

```bash
MongoDB version: 2.5.3
```

## ElasticSearch

```bash
elasticsearch-0.90.9
```

# Zadanie 2

## Menu

- [Dane](#dane)
- [Mongodb](#mongodb)
    - [Import danych](#import-danych)
    - [Czas i ilosc zaimportowanych danych](#czas-i-ilosc-zaimportowanych-danych)
    - [MongoDB: Aggregacje](#mongodb:-aggregacje)
        - [Aggregacja 1](#aggregacja-1)
- [ElasticSearch](#elasticsearch)

#Dane
    Do rozwiązania zadania wykorzystałem baze danych udostępnioną przez przez GetGlue umieszczoną na stronie dr Włodzimierza Bzyla

#Mongodb

## Import danych
    
```bash
    $ mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```
    
## Czas i ilosc zaimportowanych danych
    
![Czas importu do bazy](../../images/rtomczak/zad2_import_mongo.png "Czas importu do bazy")
    
Od razu sprawdzamy ile json'ow zaimportowalimy do bazy 
    
```bash
> db.imdb.count()
19831300
```

## MongoDB: Aggregacje

#### Aggregacja 1
    