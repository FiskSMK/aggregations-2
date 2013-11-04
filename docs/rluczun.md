#Rafał Łuczun

##Rozwiązania:

###Zadanie 1a
###Zadanie 1b
###Zadanie 1c


#Zadanie 1a

##Poprawka
Problemem w tym pliku są znaki nowej lini występujące bezpośrednio w komórkach, na pliku wystarczy wykonać prosty skrypt

```sh
cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train1.csv
```

Po przygotowaniu pliku zabieramy się za import

#Zadanie 1b

##Importowanie
Podczas importu mierzymy czas za pomocą polecenia time

```sh
time mongoimport -d test -c train --type csv --headerline --file Train1.csv
```

###Czas i wyniki

![import-result](../../images/rluczun/import.png)

#Zadanie 1c
W zadaniu musimy poprawić wszystkie tagi, na tablicę tagów, a następnie zliczyć wszystkie i różne tagi
Program napisałem przy wykorzystaniu JavaScript, który uruchomiłem przy użyciu Node.js
Do działania potrzebny jest tylko jeden dodatkowy moduł
##Uruchomienie
Jeśli posiadamy plik package.json wpisujemy:
`npm install`
`npm start`

```sh
var MongoClient = require('mongodb').MongoClient;
var COUNT = 6034195;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    db.collection('train', function(err, col) {
      if (err) {
        throw err;
      } else {
        var cursor = col.find({}, {tags: 1, _id : 1});
        cursor.each(function(err, res) {
          if (err) {
            throw err;
          } else if(res !== null) {
              status++;
              var array = new Array();
              if(Object.prototype.toString.call(res.tags) !== '[object Array]' ) {
                var tagsArray = new Array();
                if (res.tags) {
                  if (typeof res.tags === 'number') {
                    tagsArray.push(res.tags);
                  } else if (res.tags.indexOf(',') !== -1) {
                    tagsArray = res.tags.split(',');
                  } else {
                    tagsArray = res.tags.split(' ');
                  }
                }
                col.update({_id: res._id}, {$set : {tags : tagsArray}}, function(err, upd){});
              }
          } else {
            var cursor = col.find({}, {tags: 1, _id : 1}),
                status = 0,
                tagsCount = 0,
                diffTags = 0,
                numberOfTags = {};
            
            cursor.each(function(err, res){
              if (err) {
                throw err;
              } else if (res !== null) {
                console.log('Counting: ' + (status/COUNT).toFixed(2)*100) + '%';
                tagsCount += res.tags.length;
                for (var i = 0; i < res.tags.length; i++ ) {
                  if (!numberOfTags[res.tags[i]]) {
                    numberOfTags[res.tags[i]] = 1;
                  } else {
                    numberOfTags[res.tags[i]] += 1;
                  }
                }
              } else {
                console.log('Results of program');
                console.log(numberOfTags);
                for (key in numberOfTags) {
                  if (numberOfTags[key] === 1) {
                    diffTags++;
                  }
                }
                console.log('Tags occurence ^^^');
                console.log('All tags count: ' + tagsCount);
                console.log('Different tags count : ' + diffTags);
                console.log('Different tags as part of all : ' + (diffTags/tagsCount).toFixed(2)*100 + '%');
                db.close();
              }
            });
          }
        }); 
      }
    });  
  }
});
```
Kod programu najpierw wykonuje naprawę, jeśli jakiś wiersz ma pusty tag, wstawia w te miejsce pustą tablicę.
Po naprawie uruchamia się kolejna pętla która sumuje tagi i ich wystąpienia co pozwala na koniec sprawdzić które tagi były unikatowe.
Same tagi zapisuję do tablicy przy użyciu metody split, z przecinkiem bądź spacją w zależności od separatora.

##Wynik
![tag-result](../../images/rluczun/tag-results.png)
