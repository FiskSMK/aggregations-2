### *Głosowanie - Damian Matulewski*
### 
----

## Zadanie 2
* [Zadanie 2](#zadanie-2)
    * [Opis bazy](#opis-bazy)
    * [MongoDB](#mongodb)
    	* [Import bazy do mongo](#import-bazy-do-mongo)
    	* [Liczba i przykład](#liczba-i-przykład)
    	* [Pierwsza aggregacja](#pierwsza-aggregacja)
    	* [Druga aggregacja](#druga-aggregacja)
    * [Elasticsearch](#elasticsearch)
    	* [Import elasticsearch](#import-elasticsearch)
    	* [Pierwsza aggregacja elasticsearch](#pierwsza-aggregacja-elasticsearch)
    	* [Druga aggregacja elasticsearch](#druga-aggregacja-elasticsearch)

	

## Opis bazy

Baza została pobrana w formacie CSV. Bazę oczyściłem za pomocą google refine.
Baze danych pobralem z ...

## MongoDB

```bash
MongoDB shell version: 2.4.7
```

## Import bazy do mongo

```bash
mongoimport --type csv --db vote --collection vote --file vote.csv --headerline
```
## Liczba i przykład
```bash
> db.vote.count();
	 wynik=869166

> db.video.findOne();
{



}
```
## Pierwsza aggregacja:
Wyświetlenie ile zostało oddano pozytywnych, negatywnych bądz ile osób powstrzymało sie od głosu.

```bash
> db.video.aggregate



```

Wykres:
![Wykres1](../images/dmatulewski/Wykres1.png)

## Druga aggregacja:
Top 5 osób które oddały najwięcej głosów.
	
```bash
db.video.aggregate
```


```bash




```
Wykres:
![Wykres2](../images/dmatulewski/Wykres2.png)

## Elasticsearch

Elasticsearch version : 0.90.9

### Import elasticsearch
Wrzuciłem bazę w częściach, ze względu na duży rozmiar danych.
  
```bash
curl localhost:9200/vote/_bulk --data-binary @vote1.bulk
```
## Pierwsza aggregacja elasticsearch:

Wyświetlenie ile zostało oddano pozytywnych, negatywnych bądz ile osób powstrzymało sie od głosu:

```bash	
curl -XGET 




```
Wykres:
![Wykres3](../images/dmatulewski/Wykres3.png)

## Druga aggregacja elasticsearch:

Top 5 osób które oddały najwięcej głosów.

```bash
curl -XGET 




```
Wykres:
![Wykres4](../images/dmatulewski/Wykres4.png)
