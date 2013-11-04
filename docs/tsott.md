Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy:

    MongoDB
    PostgreSQL – opcjonalnie dla znających fanów SQL

Naprawienie pliku Train.csv i usunięcie zbędnych znaków nowej linii:

	cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train_prepared.csv

Ustawienie ścieżki do folderu z bazą danych:
	mongod --dbpath /media/FAKE_PATH/db

Import danych z pliku csv do bazy danych train, kolekcji train:

	time mongoimport -db train -c train -type csv --headerline -file /media/FAKE_PATH/Train_Prepared.csv

	2013-11-02T13:04:39.025+0100 		Progress: 7245393941/7253917399	99%
	2013-11-02T13:04:39.026+0100 			6027100	2071/second
	2013-11-02T13:04:40.951+0100 check 9 6034196
	2013-11-02T13:04:41.156+0100 imported 6034195 objects

Czas importu danych:*
	real	48m31.579s
	user	1m50.560s
	sys	0m14.668s

\* system na dysku zewnętrznym (ATA 7200 rpm) podłączonym pod port USB 2.0 


Zadanie 1b. Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).

Zaimportowano 6034195 rekordów:
	
	2013-11-02T13:04:41.156+0100 imported 6034195 objects

Sprawdzenie ilości rekordów w bazie train:
	db.train.count()
	6034195

Zadanie 1d. Ściągnąć plik text8.zip ze strony Matt Mahoney (po rozpakowaniu 100MB):

wget http://mattmahoney.net/dc/text8.zip -O text8.gz

Zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz liczbę różnych słów w tym pliku. Ile procent całego pliku stanowi:

    najczęściej występujące słowo w tym pliku
    10, 100, 1000 najczęściej występujących słów w tym pliku

Wskazówka: Zaczynamy od prostego EDA. Sprawdzamy, czy plik text8 zawiera wyłącznie znaki alfanumeryczne i białe:
	tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt
	ls -l deleted.txt
	-rw------- 1 supersott supersott 0 Nov  3 23:56 deleted.txt

plik deleted.txt jest pusty

Wykonano polecenia:

	wc text8
	0  17005207 100000000 text8
	tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
	wc text8.txt
	17005207  17005207 100000000 text8.txt

Import danych z pliku text8.txt do bazy danych text, kolekcji text:

	time ./mongoimport -db text8 -c text8 -type csv -fields 'word' -file /media/OS/Z_LINUXA/text8.txt

	2013-11-04T00:32:39.383+0100 imported 17005207 objects

Czas importu danych:
	real	21m56.624s
	user	0m42.900s
	sys	0m11.592s
