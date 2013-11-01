### *Piotr Kotłowski*

----

## Zadanie 1
### a)
Import za pomocą:
```
time mongoimport -d zadanie -c zadanie -type csv -file ~/Pulpit/Train.csv --headerline
```
rezultat:
```
imported 6034195 objects

real	17m49.713s
user	2m27.057s
sys	0m34.514s
```
Użycie zasobów:
!(http://i44.tinypic.com/4tn5li.png)
### b)
```
db.zadanie.count();
```
rezultat:
```
6034195
```
### c)

### d)
Import za pomocą:
```
time mongoimport --type csv -f word -d text8 -c text8 --file ./text8.txt
```
Rezultat:
```
imported 17005207 objects

real	19m30.787s
user	0m52.357s
sys	0m17.396s
```
Zliczanie wszystkich słów za pomocą ``` db.text8.count() ``` daje rezultat ``` 17005207 ```
Zliczanie wszystkich unikalnych słów za pomocą ``` db.text8.distinct("word").length ``` daje rezultat ``` 253854 ```


Procentowy udział słów w bazie
-------------

<table>
  <tr>
    <th>Ilość</th><th>Suma</th><th>Słowo(a)</th><th>Udział procentowy</th>
  </tr>
  <tr>
    <td>1</td><td>1061396</td><td>the</td><td>Awesome</td>
  </tr>
  <tr>
    <td>10</td><td>4205965</td><td>the</td><td>Nearly as awesome</td>
  </tr>
 <tr>
    <td>100</td><td>7998978</td><td>the</td><td>Nearly as awesome</td>
  </tr>
 <tr>
    <td>1000</td><td>11433354</td><td>the</td><td>Nearly as awesome</td>
  </tr>
</table>
