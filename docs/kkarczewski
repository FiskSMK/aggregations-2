Zadanie 1a.
Polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy:
MongoDB, PostgreSQL – opcjonalnie dla znających fanów SQL

Do naprawy pliku użyłem skryptu dostępnego na githubie. 
https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh
A tak wyglądało polecenie
./2unix.sh Train.csv Train2.csv 
Polecenie importowania:
time mongoimport --collection Train --type csv --file Train2.csv --headerline

Dysk HDD 7200 podłączony kablem ATA - USB2.0
Czasy:
real 49m54.265s
user 2m01.345s
sys 0m13.934s


Zadanie 1b.
Zliczyć liczbę zaimportowanych rekordów.

db.Train.count();     6034195


Zadanie 1d. Ściągnąć plik text8.zip ze strony Matt Mahoney (po rozpakowaniu 100MB):
wget http://mattmahoney.net/dc/text8.zip -O text8.gz
Zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz liczbę różnych słów w tym pliku.
Ile procent całego pliku stanowi: najczęściej występujące słowo w tym pliku, 10, 100, 1000 najczęściej
występujących słów w tym pliku. 

Ilość wszystkich słów:

db.slowa.count()
17005207

Ilość różnych słów:
db.slowa.distinct("slowo").length
253854

Ile procent stanowi 1, 10, 100, 1000 najczęstszych słów?
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 6.241594118789616
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 24.73339489486955
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 47.03840417820259
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 67.23443001899359
    }
  ],
  "ok" : 1
}
