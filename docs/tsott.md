Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy:

    MongoDB
    PostgreSQL – opcjonalnie dla znających fanów SQL

Naprawienie pliku Train.csv i usuniecie zbednych znakow nowej linii:

	cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train_prepared.csv

Ustawienie sciezki do folderu z baza danych:
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

* system na dysku zewnetrznym (ATA 7200 rpm) podlaczonym pod port USB 2.0 


Zadanie 1b. Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).

Zaimportowano 6034195 rekordow:
	
	2013-11-02T13:04:41.156+0100 imported 6034195 objects

Sprawdzenie ilosci rekordow w bazie train:
	> db.train.count()
	6034195

