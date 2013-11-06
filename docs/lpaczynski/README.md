<h1> Łukasz Paczyński </h1>

<h2>Zadanie 1</h2>

<h3><b>a)</b></h3>
<p>Import pliku</p>

  ```bash
  $ mongoimport --type csv -c Train --file Train2.csv --headerline
  ```  

<h3><b>b)</b></h3>

  ```bash
  db.Train.count()
  ```
  Liczba obiektów: 6034195 
  
![Image](../../images/lpaczynski/zadanie1b.jpg)

  
<h3><b>c)</b></h3>

<p>Skrypt konwertujący tagi na tablicę:</p>
 ```js
db.train.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.train.save(x);
}});
 ```
Plik zliczający wszystkie słowa: [count](/scripts/lpaczynski/count)
<h3><b>d)</b></h3>
Przerobiłem plik do Jsona za pomocą tego [skryptu](/scripts/lpaczynski/toJson.sh)
  ```bash
  $ ./toJson.sh text8
  ```
<p>następnie zimportowałem plik do bazy</p>
  ```bash
  $ mongoimport --d text8 -c text8 --file text8.json
  ```
  
<p>Zliczanie wszystkich słów</p>
  ```js
  db.text8.count()
  
  Rezultat: 17005207
  ```
<p>Zliczanie różnych słów</p>
  ```js
  db.text8.distinct("word").length
  
  Rezultat: 253854
  ```
<p>1 najczęściej występujące słowo </p>
 ```js
 var start = new Date().getTime();

db.text8.aggregate(
	{$group:{ _id:"$word", count:{$sum:1}}}, 
	{$sort: {count: -1}}, 
	{$limit:1})

  var end = new Date().getTime();
  var time = end - start;
  print(time);
 ```
 ```js
 Rezultat: 1061396
 Stanowi: 6,24%
 Czas: 23 sekundy
 ```
<p>10 najczęściej występujących słów</p>
 ```js
 var start = new Date().getTime();

 db.text8.aggregate(
	 {$group:{ _id:"$word", count:{$sum:1}}}, 
	 {$sort: {count: -1}}, 
	 {$limit:10})

 var end = new Date().getTime();
 var time = end - start;
 print(time);
 ```
 ```js
 Rezultat: 4205965
 Stanowi: 24,73%
 Czas: 22 sekundy
 ```
<p> 100 najczęściej występujących słów</p>
 ```js
 var start = new Date().getTime();

 db.text8.aggregate(
	 {$group:{ _id:"$word", count:{$sum:1}}}, 
	 {$sort: {count: -1}}, 
	 {$limit:100})

 var end = new Date().getTime();
 var time = end - start;
 print(time);
 ```
 ```js
 Rezultat: 7998978
 Stanowi: 47,03%
 Czas: 22 sekundy
 ```
<p> 1000 najczęściej występujących słów</p>
 ```js
 var start = new Date().getTime();

 db.text8.aggregate(
	 {$group:{ _id:"$word", count:{$sum:1}}}, 
	 {$sort: {count: -1}}, 
	 {$limit:1000})

 var end = new Date().getTime();
 var time = end - start;
 print(time);
 ```
 ```js
 Rezultat: 11433354
 Stanowi: 67,23%
 Czas: 25 sekundy
 ```
 ![Image](../../images/lpaczynski/avg.png)
<h3><b>e)</b></h3>
<p>Do rozwiązania zadania użyłem danych znajdujących się pod tym linkiem(http://www.poipoint.pl).</p>
[Baza](/data/lpaczynski/Szkolywyzsze.csv) zawiera dane dotyczące szkół wyższych w Polsce.

<p>Import do mongo</p>
 ```bash
 mongoimport -d geo -c schools --type csv --headerline --file Szkolywyzsze.csv
 ```
 <p>Rekordy:</p>
 ```js
 db.schools.count()
 
 Rezultat: 235
 ```
 <p>Wszystkie szkoły wyższe znajdujące się w Gdańsku</p>
 ```js
 db.schools.find({miasto: /Gda/}, {_id: 0}).count()
 
 Rezultat: 10
 ```
