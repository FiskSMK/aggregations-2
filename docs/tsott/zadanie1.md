<h1>Zadanie 1a</h1>
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

Czas importu danych:* <br />
	real	48m31.579s<br />
	user	1m50.560s <br />
	sys	0m14.668s <br />

\* system na dysku zewnętrznym (ATA 7200 rpm) podłączonym pod port USB 2.0 

<h1>Zadanie 1b</h1>
Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).

Zaimportowano 6034195 rekordów:
	
	2013-11-02T13:04:41.156+0100 imported 6034195 objects

Sprawdzenie ilości rekordów w bazie train:
	db.train.count()
	6034195

<h1>Zadanie 1c</h1>
(Zamiana formatu danych.) Zamienić string zawierający tagi na tablicę napisów z tagami następnie zliczyć wszystkie tagi i wszystkie różne tagi. 
Napisać program, który to zrobi korzystając z jednego ze sterowników. 
Lista sterowników jest na stronie MongoDB Ecosystem.


	obiektów:6034195
	aktualizacji:6034195
	tagów:17409994
	różnych tagów:42048
	
	
Porównanie kolekcji train i kolekcji train2:

	> db.train.findOne()
	{
		"_id" : ObjectId("5274df08e29d94cee2dbf304"),
		"Id" : 1,
		"Title" : "How to check if an uploaded file is an image without mime type?",
		"Body" : "<p>I'd like to check if an uploaded file is an image file (e.g png, jpg, jpeg, gif, bmp) or another file. The problem is that I'm using Uploadify to upload the files, which changes the mime type and gives a 'text/octal' or something as the mime type, no matter which file type you upload.</p>  <p>Is there a way to check if the uploaded file is an image apart from checking the file extension using PHP?</p> ",
		"Tags" : "php image-processing file-upload upload mime-types"
	}
	> db.train2.findOne()
	{
		"_id" : ObjectId("5274df08e29d94cee2dbf304"),
		"Id" : 1,
		"Title" : "How to check if an uploaded file is an image without mime type?",
		"Body" : "<p>I'd like to check if an uploaded file is an image file (e.g png, jpg, jpeg, gif, bmp) or another file. The problem is that I'm using Uploadify to upload the files, which changes the mime type and gives a 'text/octal' or something as the mime type, no matter which file type you upload.</p>  <p>Is there a way to check if the uploaded file is an image apart from checking the file extension using PHP?</p> ",
		"Tags" : [
			"php",
			"image-processing",
			"file-upload",
			"upload",
			"mime-types"
		]
	}




<h1>Zadanie 1d</h1>
Ściągnąć plik text8.zip ze strony Matt Mahoney (po rozpakowaniu 100MB):

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

Czas importu danych: <br />
	real	21m56.624s <br />
	user	0m42.900s <br />
	sys	0m11.592s <br />
	

<h1>Zadanie 1e</h1>
Wyszukać w sieci dane zawierające obiekty GeoJSON. Zapisać dane w bazie MongoDB.

Dla zapisanych danych przygotować 6–9 różnych Geospatial Queries (co najmniej po jednym dla obiektów Point, LineString i Polygon). W przykładach należy użyć każdego z tych operatorów: $geoWithin, $geoIntersect, $near.

Do zadania uzyto danych ze strony <a href="http://geonames.usgs.gov/">United States Board on Geographic Names</a> dla stanu Alaska.

Naprawa danych:
	cat AK_Features_20131020.txt |tr "|" "," > AK_Features_ready.txt

Import naprawionych danych do bazy baza kolekcji alaska:
	time ./mongoimport -baza -c alaska -type csv --headerline -file ../../AK_Features_ready.txt

Czas importu danych:
real	0m24.097s
user	0m2.116s
sys	0m0.156s

Przykładowy rekord po imporcie:

	> db.alaska.findOne()
	{
		"_id" : ObjectId("52793b6160d697489c0536ba"),
		"FEATURE_ID" : 247074,
		"FEATURE_NAME" : "Pacific Ocean",
		"FEATURE_CLASS" : "Sea",
		"STATE_ALPHA" : "CA",
		"STATE_NUMERIC" : 6,
		"COUNTY_NAME" : "Mendocino",
		"COUNTY_NUMERIC" : 45,
		"PRIMARY_LAT_DMS" : "391837N",
		"PRIM_LONG_DMS" : "1235041W",
		"PRIM_LAT_DEC" : 39.3102778,
		"PRIM_LONG_DEC" : -123.8447222,
		"SOURCE_LAT_DMS" : "",
		"SOURCE_LONG_DMS" : "",
		"SOURCE_LAT_DEC" : "",
		"SOURCE_LONG_DEC" : "",
		"ELEV_IN_M" : 0,
		"ELEV_IN_FT" : 0,
		"MAP_NAME" : "Mendocino",
		"DATE_CREATED" : "01/19/1981",
		"DATE_EDITED" : "05/16/2011"
	}
	> 

Po usunięciu zbędnych pól:

	

	{ 
	"_id" : ObjectId("5279428dd2b74b3b876d0e0f"),
	"id" : 1397640,
	"name" : "Cape Hinchinbrook",
	"loc" : { 
		"type" : "Point",
		"coordinates" : [
			-146.6416667,
			60.2347222
		]
	}
	} 
	



<h3>Zapytanie $near:</h3>

Punkt

		var punkt = { 
		"type" : "Point", 
		"coordinates" : [ -146.6416667,  60.2347222 ] 
		};

Zapytanie: 

	db.gotowe.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 500} }).toArray()
	
Wynik:
	[
		{
			"_id" : ObjectId("527973ea5fb24c66a30d7559"),
			"id" : 1397640,
			"name" : "Cape Hinchinbrook",
			"loc" : {
				"type" : "Point",
				"coordinates" : [
					-146.6416667,
					60.2347222
				]
			}
		},
		{
			"_id" : ObjectId("527973ec5fb24c66a30de01b"),
			"id" : 1866451,
			"name" : "Hinchinbrook Lighthouse",
			"loc" : {
				"type" : "Point",
				"coordinates" : [
					-146.65,
					60.2333333
				]
			}
		}
	]

<h3>Zapytanie $geoWithin</h3>

Punkt:

	{ 
	"_id" : ObjectId("5279428dd2b74b3b876d0e0f"),
	"id" : 1397640,
	"name" : "Cape Hinchinbrook",
	"loc" : { 
		"type" : "Point",
		"coordinates" : [
			-146.6416667,
			60.2347222
		]
	}
	} 
	
	
Zapytanie:

	db.gotowe.find({ loc: { $geoWithin: {$center : [[ -146.6416667, 60.2347222 ], 0.5 ]} } }).toArray()

Wynik (wybrane 3 obiekty z 10):

	{
			"_id" : ObjectId("527973ec5fb24c66a30db732"),
			"id" : 1414706,
			"name" : "Signal Mountain",
			"loc" : {
				"type" : "Point",
				"coordinates" : [
					-146.6380556,
					60.2844444
		obiektów:6034195
 aktualizacji:6034195
        tagów:17409994
różnych tagów:42048
{
	"_id" : ObjectId("5274df08e29d94cee2dbf304"),
	"Id" : 1,
	"Title" : "How to check if an uploaded file is an image without mime type?",
	"Body" : "<p>I'd like to check if an uploaded file is an image file (e.g png, jpg, jpeg, gif, bmp) or another file. The problem is that I'm using Uploadify to upload the files, which changes the mime type and gives a 'text/octal' or something as the mime type, no matter which file type you upload.</p>  <p>Is there a way to check if the uploaded file is an image apart from checking the file extension using PHP?</p> ",
	"Tags" : [
		"php",
		"image-processing",
		"file-upload",
		"upload",
		"mime-types"
	]
}
		]
			}
		},
		{
			"_id" : ObjectId("527973ec5fb24c66a30dd20e"),
			"id" : 1421748,
			"name" : "English Bay",
			"loc" : {
				"type" : "Point",
				"coordinates" : [
					-146.67,
					60.2908333
				]
			}
		},
		{
			"_id" : ObjectId("527973ec5fb24c66a30dd545"),
			"id" : 1422596,
			"name" : "Hinchinbrook Lighthouse Reserve",
			"loc" : {
				"type" : "Point",
				"coordinates" : [
					-146.6458333,
					60.2636111
				]
			}
		},


<h3>Zapytanie $</h3>
	 
obszar:
	 
	var area = {    
	  "type" : "Polygon",     
	   "coordinates" :     
	    [ 
			[          
				[ -147 , 61],
				[ -145 , 61 ],          
				[ -145 , 59 ],          
				[ -147 , 59 ],          
				[ -147 , 61 ]     
			] 
		] 
	};

Zapytanie:

	db.gotowe.find({ loc : { $geoIntersects : { $geometry : area } } }).toArray();

Wynik (wybrane 2 obiekty z 400):

	{
		"_id" : ObjectId("527973ec5fb24c66a30dd991"),
		"id" : 1423708,
		"name" : "Millard Lake",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-146.5800512,
				60.9060124
			]
		}
	},
	{
		"_id" : ObjectId("527973ec5fb24c66a30dba19"),
		"id" : 1415452,
		"name" : "Turner Lake",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-146.6293659,
				60.9109596
			]
		}
	},

