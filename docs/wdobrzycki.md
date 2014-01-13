# *Wojtek Dobrzycki*

* [Dane techniczne](#dane-techniczne)
* 
* [Zadanie 1a](#zadanie-1a)
* 
* [Zadanie 1b](#zadanie-1b)
* 
* [Zadanie 1c](#zadanie-1c)
* 
* [Zadanie 1d](#zadanie-1d)
* 
* [Zadanie 1e](#zadanie-1e)

---

## Dane Techniczne

Procesor:
	Intel(R)Core(TM)i5-2410M CPU 2.3GHz

RAM:
	8GB DDR3

System operacyjny:
	Windows 7 Professional x64

Środowisko:
	Cygwin 1.7.25 x64

Baza Danych:
	MongoDB 2.4.7 x64

---

## Zadanie 1a

```
Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych
z pliku Train.csv bazy:

	* MongoDB
	* PostgreSQL – opcjonalnie dla znających fanów SQL
```

Aby plik Train.csv został zaimportowany do bazy danych, trzeba usunąć znaki nowej linii. [skrypt](../../scripts/wbzyl/2unix.sh).

```sh
$ time ./2unix.sh Train.csv Ttrain.csv

real    11m30.359s
user    2m47.605s
sys     1m43.721s

$ time mongoimport -d dataBase -c train --type csv --file Ttrain.csv --headerline
connected to: 127.0.0.1
check 9 6034196
imported 6034195 objects

real    13m50.319s
user    0m0.000s
sys     0m0.029s
```

Średnio ~6311 import'ów na sekundę

---

## Zadanie 1b

```
Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).
```

```js
> db.train.count()
6034195
```

---

## Zadanie 1c

```
(Zamiana formatu danych.) Zamienić string zawierający tagi na tablicę napisów z tagami następnie zliczyć
wszystkie tagi i wszystkie różne tagi. Napisać program, który to zrobi korzystając z jednego ze sterowników.
```

Przykładowy rekord:

```js
> db.train.findOne()
{
        "_id" : 9692,
        "title" : "SQL Server 2005 question about procedure cache",
        "body" : "<p>Server: SQL Server 2005 SP2 64 bit, 32 gigs of memory. 2 instances of SQL server running. Main instance I'm using has 20 gigs visible.</p>  <p>We have a situation where it appears every so often our entire procedure cache is cleared which in turn is forcing stored procedure (sp) recompiles. Once the sp is in the cache everything runs fast for a little while. After a couple hours, it's cleared from the cache and has to be recompiled causing things to run slow briefly.</p>  <p>I'm watching the cache using:</p>  <pre><code>SELECT cp.objtype AS PlanType, OBJECT_NAME(st.objectid,st.dbid) AS ObjectName, cp.refcounts AS ReferenceCounts, cp.usecounts AS UseCounts, st.TEXT AS SQLBatch, qp.query_plan AS QueryPlan FROM sys.dm_exec_cached_plans AS cp CROSS APPLY sys.dm_exec_query_plan(cp.plan_handle) AS qp CROSS APPLY sys.dm_exec_sql_text(cp.plan_handle) AS st GO </code></pre>  <p>DBCC FREEPROCCACHE is never called.</p>  <p>If I run DBCC MEMORYSTATUS I can see the TotalPages of the procedure cache as being around 500k pages. This comes out to be 3.9 Gigs allocated to the cache. Referencing: <a href=\"http://msdn.microsoft.com/en-us/library/ee343986.aspx\" rel=\"nofollow\">Plan Caching in SQL Server 2008</a> (The section on caching includes 2005 SP 2). It indicates the pressure limit should be 4.6 gigs. (75% of visible target memory from 0-4GB + 10% of visible target memory from 4Gb-64GB + 5% of visible target memory > 64GB... 3gigs + 1.6 gigs = 4.6 gigs)</p>  <p>This seems to indicate that we shouldn't be under cache pressure for another 700 megs. If the statistics were changing then the stored procedure should still be in the cache and recompiled when it's next run and it checks the statistics. If this was the case I would expect the cache to stay at almost constant size.</p>  <p>Any ideas what might be causing the procedure cache to empty or what else I should keep an eye on to try to find the cause?</p> ",
        "tags" : "sql-server sql-server-2005 cache stored-procedures",
        "rnd" : 0.5000135693699121
}
```

Do tego zadania wykorzystałem skrypt, który rozbija 'spacjami' pole tags typu String na tablice String'ów.

```sh
$ time mongo 1c.js
6032934 records updated

real    11m9.311s
user    0m0.000s
sys     0m0.017s
```

Średnio ~7664 update'ów na sekundę

Przykładowy poprawiony rekord:

```js
> db.train.findOne()
{
        "_id" : 9692,
        "body" : "<p>Server: SQL Server 2005 SP2 64 bit, 32 gigs of memory. 2 instances of SQL server running. Main instance I'm using has 20 gigs visible.</p>  <p>We have a situation where it appears every so often our entire procedure cache is cleared which in turn is forcing stored procedure (sp) recompiles. Once the sp is in the cache everything runs fast for a little while. After a couple hours, it's cleared from the cache and has to be recompiled causing things to run slow briefly.</p>  <p>I'm watching the cache using:</p>  <pre><code>SELECT cp.objtype AS PlanType, OBJECT_NAME(st.objectid,st.dbid) AS ObjectName, cp.refcounts AS ReferenceCounts, cp.usecounts AS UseCounts, st.TEXT AS SQLBatch, qp.query_plan AS QueryPlan FROM sys.dm_exec_cached_plans AS cp CROSS APPLY sys.dm_exec_query_plan(cp.plan_handle) AS qp CROSS APPLY sys.dm_exec_sql_text(cp.plan_handle) AS st GO </code></pre>  <p>DBCC FREEPROCCACHE is never called.</p>  <p>If I run DBCC MEMORYSTATUS I can see the TotalPages of the procedure cache as being around 500k pages. This comes out to be 3.9 Gigs allocated to the cache. Referencing: <a href=\"http://msdn.microsoft.com/en-us/library/ee343986.aspx\" rel=\"nofollow\">Plan Caching in SQL Server 2008</a> (The section on caching includes 2005 SP 2). It indicates the pressure limit should be 4.6 gigs. (75% of visible target memory from 0-4GB + 10% of visible target memory from 4Gb-64GB + 5% of visible target memory > 64GB... 3gigs + 1.6 gigs = 4.6 gigs)</p>  <p>This seems to indicate that we shouldn't be under cache pressure for another 700 megs. If the statistics were changing then the stored procedure should still be in the cache and recompiled when it's next run and it checks the statistics. If this was the case I would expect the cache to stay at almost constant size.</p>  <p>Any ideas what might be causing the procedure cache to empty or what else I should keep an eye on to try to find the cause?</p> ",
        "rnd" : 0.5000135693699121,
        "tags" : [
                "sql-server",
                "sql-server-2005",
                "cache",
                "stored-procedures"
        ],
        "title" : "SQL Server 2005 question about procedure cache"
}
```

---

## Zadanie 1d

```
Ściągnąć plik text8.zip, zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz
liczbę różnych słów w tym pliku. Ile procent całego pliku stanowi:

	* najczęściej występujące słowo w tym pliku
	* 10, 100, 1000 najczęściej występujących słów w tym pliku
```

Sprawdzamy, czy plik text8 zawiera wyłącznie znaki alfanumeryczne i białe oraz znaki puste zastępujemy znakiem nowej linii.

```sh
$ tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt

$ ls -l deleted.txt
-rw-r--r-- 1 froggman None 0 11-04 19:55 deleted.txt

$ rm deleted.txt

$ wc text8
        0  17005207 100000000 text8

$ tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt

$ wc text8.txt
 17005207  17005207 100000000 text8.txt
 
$ time mongoimport -d text8 -c text8 -f word --type csv --file text8.txt
connected to: 127.0.0.1
check 9 17005208
imported 17005207 objects

real    6m8.782s
user    0m0.000s
sys     0m0.015s
```

Ilość wystąpień wszystkich słów:

```js
> db.text8.count()
17005207
```

Ilość wystąpień różnych słów:

```js
> db.text8.distinct("word").length
253854
```

Najpopularniejsze słowo, jego ilość wystąpień oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1}
> ])
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }

> 1061396 / 17005207 * 100
6.241594118789616
```

Ilość wystąpień 10 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 10},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }

> 4205965 / 17005207 * 100
24.733394894869555
```

Ilość wystąpień 100 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 100},
> 	{$group: {_id: null, count: {$sum: "$count"}}},
> ])
{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }

> 7998978 / 17005207 * 100
47.03840417820259
```

Ilość wystąpień 1000 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1000},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }

> 11433354 / 17005207 * 100
67.23443001899359
```

---



