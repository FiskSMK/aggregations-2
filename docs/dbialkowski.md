### *Dominik Białkowski*

Procesor: Pentium(R) Dual-Core CPU T4200 @ 2.00GHz × 2

Dysk Twardy: 30.6 GB

Pamięć RAM: 3.8 GB

System operacyjny: Ubuntu 13.10 x64


Wersja mongodb: 2.4.8

#Zadanie 1a 

-usuniecie w pliku Train.csv znaków nowej linii za pomocą skryptu

-zaimportowanie do danych do bazy:

imported 6034195 objects

time: 15m12.235s

#Zadanie 1b


	db.Train.count()


Wynik: 6034195



#Zadanie 1d


	wget http://mattmahoney.net/dc/text8.zip -O text8.gz

zapis w 12m 13s


rozpakowanie pliku text8.gz i użycie polecenia:


	tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt


następnie:
	
	
	ls -l deleted.txt
	
	
 -rw-r--r-- 1 domin domin 0 sty  3 20:25 deleted.txt
	
	
	
	chmod 664 deleted.txt
	
	
 -rw-rw-r-- 1 domin domin 0 sty  3 20:25 deleted.txt
	
	
	rm deleted.txt
	wc text8
	
	
 0         17005207 100000000 text8
	
	
	
	tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
	wc text8.txt
	
	
 17005207  17005207 100000000 text8.txt



mongo import:
	
	
	sed 1d text8.txt | sed '1s/^/word\n/' > text8.csv
	
	time mongoimport --type csv -c text8 --file text8.csv --headerline
	
	
real	15m30.141s	
user	1m7.095s	
sys	0m14.205s	


	connecting to: test

	db.text8.count()


ilość zaimportowanych słów:  17005207

	
	db.text8.distinct("word").length

	
ilość różnych słów w bazie:  253854
	
	
	db.text8.aggregate([ {$group:{ _id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1} ])
	
najczęstsze słowo:  
	{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
	
	
	db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])
	
	
10 najczęstszych słów:  
	{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }
	
	
	db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:100}, {$group:{_id: null, count:{$sum:"$count"}}} ])
	
	
100 najczęstszych słów:  
	{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }
	
	
	db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1000}, {$group:{_id: null, count:{$sum:"$count"}}} ])
	
	
1000 najczęstszych słów:  
	{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }



	

