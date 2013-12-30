# *Konrad Mieszała*

Do rozwiązania problemu użyłem pliku xls z wymyślonymi danymi, który otrzymałem od Meritum Banku, w ramach zajęć z innego przedmiotu. Zapisałem plik xls jako plik csv. 

### Zapisanie danych w bazach MongoDB:
```sh
cat Drugi.csv | replace "\n" " " | replace "\r" "\n" > DrugiPrzerobiony.csv
```
Po pozbyciu się białych znaków przeszedłem do importowania danych:
```sh
mongoimport --type csv -c Drugi --file DrugiPrzerobiony.csv --headerline
```
![](../images/kmieszala/drugie1.JPG)







