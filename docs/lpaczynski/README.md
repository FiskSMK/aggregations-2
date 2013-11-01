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
<p>Zliczanie różnych słów<p>
  ```js
  db.text8.distinct("word").length
  
  Rezultat: 253854
  ```
