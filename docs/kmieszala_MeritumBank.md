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







