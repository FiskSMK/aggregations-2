### *Konrad Kubacki*

### Środowisko testowe.
##### Windows 8.1 pro 64 bit , core i5 8GB ram 750GB 7200 obr/min.
#####Do wykonywania poleceń linuxowych wykorzystywałem cygwina.
#####Przy importowaniu baz danych Pamięć ram była obciążona maksymalnie, natomiast użycie procesora wynosiło ok 35%.
----

## Zadanie 1
### a) Import danych z pliku CSV do bazy danych
```
mongoimport -d mydb -c train -type csv -file TrainPoprawiony.csv --headerline
```
rezultat:
```
imported 6034195 objects
```
Zeby móc zaimportować bazę danych do mongo musiałem oczyścić bazę za pomocą następujecego  [Skryptu](/docs/kkubacki/wbfix.sh)
Pierwszy nieudany import trwał jakieś 6 może 7 godzin , następny import po uprzednim oczyszczeniu pliku Train trwał około 30min.


### b) Zliczanie ilośći zaimportowanych rekordów
```
db.train.count();
```
Rezultat jest sporo większy niż oczekiwany.
```
21 768 811
```
### b) Zamienić string z tagami na tablice stringów.
W tym podpunkcie napisąłem prosty program w C# który to zrobił. program jest dostępny pod https://bitbucket.org/konrad_kubacki/nosql
Pomysł jest prosty. tj. mamy Klasę Element , która reprezentuję nasz pojedyńczy dokument z mongodb następnie importujemy za pomocą sterownika mongo db.
Do klasy Element dodajemy propercję która jest listą stringów  po wcześniejszym wykonaniu splita na propercji Tags.

 
### d) Import z pliku do bazy danych
Import za pomocą:
```
mongoimport --type csv -f word -d text8 -c text8 --file text8.txt
```
Rezultat:
```
imported 17005207 objects
```
#####Zliczanie ilośc słów w bazie text8
Wszytskie słowa: ``` db.text8.count() ``` Otrzymamy: ``` 17005207 ```

Zliczanie wszystkich unikalnych słów za pomocą ``` db.text8.distinct("word").length ``` Otrzymamy: ``` 253854 ```

Zliczanie 1/10/100/1000 najczęściej występujących słów, gdzie IloscSlow IN (1,10,100,1000)
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:IloscSlow}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```
Ilość wszystkich słów: 17005207.
``` db.text8.count() ```
<pre>
Udział procentowy wygląda następująco:
```  1 1061396/17005207 = 0.0624 *100% ~ 6.24%  ```
``` 10 4205965/17005207 = 0.2473 *100% ~  24.73% ```
``` 100 7998978/17005207=0.4704 *100% ~ 47% ```
``` 1000  11433354/17005207=0.6723 * 100% ~ 67% ```
</pre>

### d) Zadanie z GeoJson
<pre>
Bazę można znaleść pod następującym linkiem:  http://geonames.usgs.gov/docs/stategaz/NationalFile_2013102
Plik należy oczyścić przez zamianę znaku ``` | ``` na ``` , ``` możemy zrobić to polecenien tr 
``` tr '|' ',' < Geojson1 > geoPoprawiony.txt ```
Następnie importujemy do bazy.
``` mongoimport -d geo -c geo -type csv -file  geoPoprawiony.txt --headerline ```
Rezultat: 
``` imported 2251155 objects ```
Następnie musimy przeczyścić naszą bazę danych przez wykorzystanie dwóch skryptów: [Fix1](/docs/kkubacki/GeoFix1) [Fix1](/docs/kkubacki/GeoFix2)
Aby móc korzystać z poleceń Geospatial Queries musimy odpowiednio przygotować naszą bazę danych przez uruchomienie nestępującej komendy:
 ``` db.geo_points.ensureIndex({"loc" : "2dsphere"}) ``` 
</pre>






























