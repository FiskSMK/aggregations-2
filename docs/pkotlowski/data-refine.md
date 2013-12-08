### *Piotr Kotłowski*

----
Dane pobrałem ze strony http://www.ourairports.com/data/
Następnie oczyściełem je za pomocą narzędza google refine. 
#### Usunąłem niepotrzebne kolumny
#### Wybrałem dane dla lotnisk, usunąłem lądowiska 

Przykładowe 3708 lokalizacji na mapie google (wszystkie lotniska z regularnymi połączeniami):



## Zadanie 1
### Ilość lotnisk na poszczególnych kontynantach

Zapytanie:
```json
db.test.aggregate(
{ $group :
        { _id : { kontynent : "$continent"},
        ilosc : { $sum : 1 }}
    },
    { $sort : { ilosc : -1 }},
    { $group :
        { _id : "$_id.kontynent",
        ilosc : { $first : "$ilosc" }}
    },
    { $sort : { _id : 1 }}
)

```

Rezultat:
```json
{
	"result" : [
		{
			"_id" : "AF",
			"ilosc" : 2526
		},
		{
			"_id" : "AN",
			"ilosc" : 26
		},
		{
			"_id" : "AS",
			"ilosc" : 3454
		},
		{
			"_id" : "EU",
			"ilosc" : 4989
		},
		{
			"_id" : "NA",
			"ilosc" : 24964
		},
		{
			"_id" : "OC",
			"ilosc" : 2609
		},
		{
			"_id" : "SA",
			"ilosc" : 6866
		}
	],
	"ok" : 1
}
```
![img](http://i.imgur.com/JgJT3LR.jpg)

## Zadanie 2
### Liczba poszczególnych wielkości lotnisk w Polsce, obsługujących regularne połączenia posortowana według ilości malejąco.

```json
db.test.aggregate(
    { $match : { scheduled_service : "yes" , iso_country : "PL"}},

{ $group :
        { _id : { type : "$type"},
        ilosc : { $sum : 1 }}
    },
    { $sort : { ilosc : -1 }},
    { $group :
        { _id : "$_id.type",
        ilosc : { $first : "$ilosc" }}
    },
    { $sort : { _id : 1 }}
)
```
Rezultat:
```json
{{
	"result" : [
		{
			"_id" : "large_airport",
			"ilosc" : 7
		},
		{
			"_id" : "medium_airport",
			"ilosc" : 5
		},
		{
			"_id" : "small_airport",
			"ilosc" : 2
		}
	],
	"ok" : 1
}
```
![img](http://i.imgur.com/fDPNTjH.jpg)