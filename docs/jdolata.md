##Sprzęt:

Processor: Intel® Pentium® dual-core processor T2370 
clock speed : 1.73 GHz
Front Side Bus : 533 MHz
2nd level cache : 1 MB

Operating System / Platform	
Ubuntu 12.04

System memory : 2,048 MB
technology : DDR2 RAM (667 MHz)
 
Hard disk ??? capacity : 200 GB
certification : S.M.A.R.T. 
drive rotation : 5,400 rpm

##Zadanie 1a:

###Przetwarzanie danych:
```
 time ./2unix.sh Train.csv Train2.csv
```
###Czasy wykonania
```
real	23m42.614s
user	0m59.212s
sys	2m5.916s
```
###Importowanie danych:
```
time mongoimport -c train --type csv --file Train2.csv --headerline
```

check 9 6034196
imported 6034195 objects

###Czasy wykonania
```
real	14m48.545s
user	3m0.250s
sys	0m26.138s
```

##Zadanie 1b
```
MongoDB shell version: 2.4.8
use test
connecting to: test
> db.train2.count()
6034195
> 
```
##Zadanie 1c
Skrypt:
```
db.train2.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.train.save(x);
}});
```
co daje wynik:
```
> db.train2.findOne();
{
	"_id" : 1,
	"title" : "How to check if an uploaded file is an image without mime type?",
	"body" : "<p>I'd like to check if an uploaded file is an image file (e.g png, jpg, jpeg, gif, bmp) or another file. The problem is that I'm using Uploadify to upload the files, which changes the mime type and gives a 'text/octal' or something as the mime type, no matter which file type you upload.</p>  <p>Is there a way to check if the uploaded file is an image apart from checking the file extension using PHP?</p> ",
	"tags" : [
		"php",
		"image-processing",
		"file-upload",
		"upload",
		"mime-types"
	]
}
```
##Zadanie 1d
import
```
time mongoimport --collection text --type csv --file text8.txt --headerline

check 9 17005207
imported 17005206 objects

real	14m43.700s
user	1m20.050s
sys	0m16.072s
```
ilość słów
```
> db.text.count()
17005206
```

pojedyńczy rekord
```
> db.text.findOne()
{ "_id" : ObjectId("52e2be5807ea109d8de143e0"), "anarchism" : "originated" }
```

ilość unikatowych
```
> db.text.distinct('anarchism').length
253854
```



[![chart1(http://i.imgur.com/6B8YjJw.png)]
zużycie procesora
[![chart2(http://i.imgur.com/94Ruv21.png)]
