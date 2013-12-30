# *Konrad Mieszała*

Do rozwiązania problemu użyłem pliku xls z wymyślonymi danymi, który otrzymałem od Meritum Banku, w ramach zajęć z innego przedmiotu. Zapisałem plik xls jako plik csv. 
### Przykładowy rekord:
```sh
konrad@Konrad:~$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> db.Drugi.findOne()
{
	"_id" : ObjectId("52c0a38b938b72a6fc3885bd"),
	"data_pisma" : "21-11-2013",
	"imie_ azwisko" : "Nikka Griffi",
	"azwa_ulicy" : "Krucza",
	"kod_pocztowy" : "67-740",
	"miejscowosc" : "Tylewice",
	"syg atura" : "Z/282256",
	"data_wplywu_pisma" : "26-01-2012",
	"zadluze ie" : 300000,
	"ast_rata" : 30367.34,
	"ile_rat" : 245,
	"imie_matki" : "Edie"
}
> 

```
### Zapisanie danych w bazach MongoDB:
```sh
cat Drugi.csv | replace "\n" " " | replace "\r" "\n" > DrugiPrzerobiony.csv
```
Po pozbyciu się białych znaków przeszedłem do importowania danych:
```sh
mongoimport --type csv -c Drugi --file DrugiPrzerobiony.csv --headerline
```
![](../images/kmieszala/drugie1.JPG)

### Agragacje MongoDB
10 najczęściej występujących miejscowości:
```sh
> db.Drugi.aggregate(         { $group: { _id: "$miejscowosc", count: { $sum: 1 } } } ,         { $sort: { count: -1 } },         { $limit: 10 })
{
	"result" : [
		{
			"_id" : "Gdańsk",
			"count" : 170800
		},
		{
			"_id" : "Warszawa",
			"count" : 66700
		},
		{
			"_id" : "Kraków",
			"count" : 23800
		},
		{
			"_id" : "Wrocław",
			"count" : 21500
		},
		{
			"_id" : "Łódź",
			"count" : 14500
		},
		{
			"_id" : "Poz ań",
			"count" : 13000
		},
		{
			"_id" : "Gdy ia",
			"count" : 11800
		},
		{
			"_id" : "Katowice",
			"count" : 10100
		},
		{
			"_id" : "Bydgoszcz",
			"count" : 9500
		},
		{
			"_id" : "Częstochowa",
			"count" : 8900
		}
	],
	"ok" : 1
}
```





