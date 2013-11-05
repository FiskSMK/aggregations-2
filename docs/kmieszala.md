### Konrad Mieszała

Procesor: 

model name	: Intel(R) Core(TM) i3 CPU       M 350  @ 2.27GHz

*Zadanie
- 1a)
Pozbycie się białych znaków:
```sh
time cat Train.csv | replace "\n" " " | replace "\r" "\n" > TrainPrzerobiony.csv
```
```
real	7m40.809s
user	3m17.495s
sys	0m57.287s

```
Import:
```sh
mongoimport --type csv -c Train --file TrainPrzerobiony.csv --headerline
```
```

```
- 1b)
