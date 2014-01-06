### *Dominik Białkowski*

# Current Census Blocks for McKinley County, New Mexico, 2006se TIGER 


#Import do baz
	
zaimportowanie pliku do bazy mongo:

	 mongoimport --db db --collection tgr2006 < tgr2006.json


sprawdzenie ilosci rekordow:
	 
	db.tgr2006.count()

Wynik:
 
	1109422

Przygotowanie do imporu dla bazy Elasticsearch


	mongoexport -c tgr2006 -o tgr.json

	jq --compact-output '{ "index" : { "_type" : "tgr2006" } }, .' tgr.json > tgr2006.bulk


rozdzielenie pliku:
	
	split -l 250000 tgr2006.bulk

import do bazy:

		time for i in x*; do curl -s -XPOST localhost:9200/data/_bulk --data-binary @$i > /dev/null; echo $i; done

wynik czasowy:

		real	8m2.126s
		user	0m0.544s
		sys	0m1.149s

liczba rekordów:

		curl -XGET 'http://localhost:9200/data/tgr2006/_count'; echo

wynik: 

	{"count":1109422,"_shards":{"total":5,"successful":5,"failed":0}}



	







