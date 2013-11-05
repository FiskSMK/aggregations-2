### *Damian Matulewski*

----

### Zadanie 1a


Baze zaimporotwalem za pomoca

```sh

-mongoimport -d test -c train --type csv --file C:\Train_popr.csv --headerline

```

Czas importu wyniosl okolo 30 minut.

### Zadanie 1b

Dane zliczyłem za pomocą:

```js
db.train.count()
6034195
```
