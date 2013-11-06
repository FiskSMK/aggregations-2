### *Piotr Kłeczek*

----

### Zadanie 1
#### Konfiguracja
Laptop Acer Extensa 5630EZ z procesorem [Intel® Pentium® Processor T4200(1M Cache, 2.00 GHz, 800 MHz FSB)](http://ark.intel.com/pl/products/37251/Intel-Pentium-Processor-T4200-1M-Cache-2_00-GHz-800-MHz-FSB) oraz 2GB ramu.

System Ubuntu 12.04 LTS 64-bitowy

##### MongoDB
```sh
$ mongo --version
MongoDB shell version: 2.4.8
```


#### 1a) Import *Train.csv*

##### Przygotowanie danych
```sh
$ time ./prepareData.sh Train1.csv Train.csv
real    15m14.076s
user    0m42.700s
sys 	1m57.932s
```
##### Import
```sh
$ time mongoimport -db train -c train -type csv -file Train.csv --headerline
Tue Nov  5 21:26:51.082 imported 6034195 objects

real    12m4.822s
user    2m38.012s
sys     0m25.052s
```
##### Obciążenie podczas importu
![htop](../../images/pkleczek/import.png)

##### Rozmiar bazy
```sh
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> show dbs
local   0.078125GB
train   11.9482421875GB
```

##### Wykresy MMS

![MMS](../../images/pkleczek/mongostats.png)

#### 1b) Liczba zaimportowanych rekordów
```sh
$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> use train
switched to db train
> db.train.count()
6034195
```