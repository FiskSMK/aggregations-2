# Pogoda w Edenburgu #

###Krzysztof Skowroński###


## Spis treści ##
1. [Dane](#dane)
2. [Transformacje danych](#transformacje-danych)
3. [MongoDB](#mongodb)
 1. [Import](#import-w-mongo)
 1. [Agregacje](#agregacje-w-mongodb)


# Dane #

Do wykonania zadania zostały użyte dane o pogodowe z miasta Edenburg w Anglii ze strony http://www.ed.ac.uk/schools-departments/geosciences/weather-station/download-weather-data

Dane z jednego roku zawierają około 500000 rekordów więc zostały zaimportowane pliki z 3 lat.

Przykładowy rekord:

```
2008/05/01 00:01,993,0,0.875,30.14,6.993,91.7,0,-9999
```
Kolejne liczby wskazują kolejno:

 - Datę i godzinę
 - Ciśnienie atmosferyczne (mBar)
 - Opady deszczu (mm)
 - Prędkość wiatru (m/s)
 - Kierunek wiatru (stopnie)
 - Temperatura (C)
 - Wilgotność (%)
 - Aktywność słoneczna(Kw/m2)
 - Bateria (V)

# Transformacje danych #

####Kolumna z danymi o baterii została usunięta####

Dane o napięciu baterii nie są do niczego potrzebne

####Kolumna Data i godzina zostały rozdzielone####

Data i godzina zapierały datę i godzinę w jednej kolumnie więc zostały rozdzielone na dwie osobne kolumny gdyż kążdego dnia pomiar był robiony co sekunde

####Plik został przeformatowany do formatu json####

####Przykładowy rekord po transformacji#####

```
{
	"_id" : ObjectId("52c17205bbadaa669cd9f683"), 
	"date" : "2011/01/01", 
	"time" : "00:01", 
	"atmospheric_pressure" : 1022, 
	"rainfall" : 0, 
	"wind_speed" : 4.104, 
	"wind_direction" : 239.1, 
	"surface_temperature" : 6.593, 
	"relative_humidity" : 85.8, 
	"solar_flux" : 0 
}
```

# MongoDB #

##Import w Mongo##

Dane zostały zaimportowane do MongoDB następującymi poleceniami

```
mongoimport -d weather -c weather --type json --file JCMB_2011.csv.json
mongoimport -d weather -c weather --type json --file JCMB_2012.csv.json
mongoimport -d weather -c weather --type json --file JCMB_2013.csv.json
```

##Agregacje w MongoDB##

###Maksymalna i minimalna temperatura w latach 2011-2013###

W jaki dzień była najwyższa a w jaki najniższa temperatura.

**Polecenia agregacji**
```
> db.weather.aggregate({ $match: {} }, { $group: { _id: "$date", maxtemp: { $max: "$surface_temperature" } } }, {$sort: {_id: 1}})

...
{
        "_id" : "2013/11/08",
        "maxtemp" : 8
},
{
        "_id" : "2013/11/09",
        "maxtemp" : 5.638
},
{
        "_id" : "2013/11/10",
        "maxtemp" : 7.65
},
{
        "_id" : "2013/11/11",
        "maxtemp" : 12.88
}
...
```

**Esksport wyników do CSV**

Aby móc wykorzystać dane w innych narzędziach (W celu stworzenia wykresów) zostały one wyeksportowane do formatu csv przygotowanym [skryptem](../scripts/kskowronski/temperature.js)

```
mongo weather scripts/temperature.js > dane.csv

Date,Temperature
2011/01/01,6.667
2011/01/02,1.451
2011/01/03,3.769
2011/01/04,5.533
2011/01/05,3.993
2011/01/06,2.747
...
```

**Wykres**

![Maksymalne temperatury - wykres](../images/kskowronski/temperatury.png)

**Wnioski**

W Edenburgu we wszystkie dni (małym wyjątkiem) temperatura jest powyżej zera.

### Ilość opadów w miesiącach ###

Ile spadło deszczu w poszczególnych miesiącach w latach 2011-2013

**Polecenie agregacji**

```
db.weather.aggregate(
{$group: { _id: {$substr: ["$date", 0, 4]}, totalrainfall: {$sum: "$rainfall"} }},
{$match: { totalrainfall: {$gt: 0}}}, 
{$sort: {_id: 1}}
)
```

**Eksport wyników do CSV**

Do przeformatowania wyników również został wykorzystany odpowiedni skrypt ([rain.js](../scripts/kskowronski/rain.js))

```
mongo weather rain.js > test2.csv

Month,Rainfall
2011/01,106.80000000000048
2011/02,308.19999999999663
2011/03,147.20000000000067
```

**Wykres**

![Pogoda - wykres](../images/kskowronski/opady.png)

**Wnioski**

W ostatnim roku ilość opadów znacznie spadła.

