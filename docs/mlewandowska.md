[Zadanie 1] (/docs/tsott.md)

<h1>Zadanie 2</h1>

Dane dotyczą popularności imion żeńskich i męskich w trzech stanach USA (CA, TX, IL) w latach 1910 - 2012. 
Baza MongoDB zainstalowana pod systemem Windows 7.

<h2>MongoDB - import danych
</h2>

```sh

mongoimport -d babies -c names --type csv --headerline --file names.csv


```
