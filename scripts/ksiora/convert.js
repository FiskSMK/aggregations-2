var cursor = db.Train.find();
var liczbaRekordow = db.Train.count();
var licznikRekordow = 0;
var licznikZmian = 0;
var licznikTagow = 0;
var licznikRoznychTagow = 0;
var tagi = {};
var rekordy = [];

cursor.forEach(function (dokument) {
  licznikRekordow++;
  var rozdzieloneTagi = [];
  if(dokument.tags.constructor === String) { //jesli tagi sa stringiem
    rozdzieloneTagi = dokument.tags.split(" "); //rozdzielamy string do tablicy
    licznikZmian++;
  } 
  else { 
    rozdzieloneTagi.push(dokument.tags);
    licznikZmian++; 
  }
  dokument.tags = rozdzieloneTagi; //podmieniamy tagi w dokumencie na tablice rozdzielonych tagów
  licznikTagow = licznikTagow + rozdzieloneTagi.length; //zliczamy ilosc tagow 

  for(var i=0; i < rozdzieloneTagi.length; i++) { //przechodzimy przez wszystkie tagi danego dokumentu
    if(tagi[rozdzieloneTagi[i]] === undefined) {  
      tagi[rozdzieloneTagi[i]] = 1; //ustawiamy licznik wystapienia danego taga na 1, aby nie liczyć go przy ponownym jego wystąpieniu
      licznikRoznychTagow++; 
    }
  }

  rekordy.push(dokument); //dodajemy zmieniony dokument do tabeli rekordów do dodania
  if(licznikRekordow === liczbaRekordow || licznikRekordow % 10000 === 0 ){ // co 10 tys rekordow robimy insert zmienionych danych
    db.train2.insert(rekordy);
    rekordy = []; //zerujemy tablice rekordów do dodania
  }
});

print("rekordy:" + licznikRekordow);
print("dokonano zmian:" + licznikZmian);
print("ilosc tagów:" + licznikTagow);
print("ilosc różnych tagów:" + licznikRoznychTagow);