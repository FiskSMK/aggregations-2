#Rafał Łuczun

##Rozwiązania:

* [Zadanie 1a](#zadanie-1a)
* [Zadanie 1b](#zadanie-1b)
* [Zadanie 1c](#zadanie-1c)
* [Zadanie 1d](#zadanie-1d)
* [Zadanie 1e](#zadanie-1e)

#Zadanie 1a

##Poprawianie csv
Problemem w tym pliku są znaki nowej lini występujące bezpośrednio w komórkach, na pliku wystarczy wykonać prosty skrypt

```sh
cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train1.csv
```

***

#Zadanie 1b

##Importowanie
Po wcześniejszym przygotowaniu pliku zabieramy się za import, podczas którego mierzymy czas za pomocą polecenia time

```sh
time mongoimport -d test -c train --type csv --headerline --file Train1.csv
```

##Czas i wyniki

![import-result](../../images/rluczun/import.png)

***

#Zadanie 1c
W zadaniu musimy zamienić listy tagów, na tablicę tagów, a następnie zliczyć wszystkie tagi i unikatowe tagi
Program napisałem przy wykorzystaniu JavaScript, a uruchomiłem przy użyciu Node.js
Do działania potrzebny jest tylko jeden dodatkowy moduł do obsługi mongodb

##Uruchomienie
Plik package.json potrzebny do uruchomienia można znaleść tutaj [package.json](../../scripts/rluczun/package.json)
Plik źródłowy ze skryptem znajdziemy tutaj [mongotrainer.js](../../scripts/rluczun/mongotrainer.js) 

Umieszczamy je oba w jednym katalogu i wpisujemy w konsoli
`npm install`
`npm start`

Program naprawia tagi, szukając odpowiedniego separatora do podziału, po naprawie tagi umieszczane są w tablicy którą zostanie nadpisana poprzednia lista tagów.
Zanim tagi zostaną uaktualnione, program zlicza je, a także zapisuje częstotliwość występowania tagu.
Jeśli aktualnie wszystkie tagi w bazie są już tablicami, program tylko liczy i wypisuje rezultat.

##Wynik
![tag-result](../../images/rluczun/tags_result.png)

Unikatowe tagi liczę szukając tagów z pojedyńczym wystąpieniem w obiekcie z częstotliwością tagów

##Obciążenie
Obciążenie komputera podczas działania programu jest dość spore, użycie zasobów interpretera JavaScript również na wysokim poziomie:
![usage](../../images/rluczun/tags_js_usage.png)

***

#Zadanie 1d
Zadanie to polegało na zaimportowaniu słow z pliku, zliczeniu ich, zliczeniu unikatów i podaniu częstotliwości ich występowania.
Plik z którego miał nastąpić import, najpierw musiałbyć sprawdzony skryptem który był wskazówką do zadania, u mnie wszystko przebiegło sprawnie.

##Import
```sh
time mongoimport -d test -c words -f word --type csv --file text8.txt
```

##Czas
![import-words](../../images/rluczun/import_words.png)

Zadanie przygotowałem w JavaScript przy wykorzystaniu Node.js, aby uruchomić skrypt należy przenieść plik [word_counter.js](../../scripts/rluczun/word_counter.js) do folderu roboczego z poprzedniego zadania
i wpisać `npm word_counter.js`

##Wyniki
![import-words](../../images/rluczun/words_result.png)
---
Obciążenie serwera mongo podczas agregacji
![mongod-aggregate](../../images/rluczun/mongod_aggregate.png)

#Zadanie 1e
