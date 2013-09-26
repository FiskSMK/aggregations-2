# Imieniny

Plik [imieniny.csv]()
zawiera następujące dane:

```csv
day,month,names
01,01,Mieszka Mieczysława Marii
02,01,Izydora Bazylego Grzegorza
...
31,12,Sylwestra Melanii Mariusza
```

Dane te zaimportujemy do bazy MongoDB o nazwie *test* i kolekcji *imieniny*.
Skorzystamy z programu *mongoimport*:

```sh
mongoimport --drop --headerline --type csv --collection imieniny < imieniny.csv
```

Po zainstalowaniu gemu *mongo* przechodzimy na konsolę *irb*
gdzie wykonujemy poniższe polecenia:

```ruby
require 'mongo'
include Mongo

db = MongoClient.new("localhost", 27017, w: 1, wtimeout: 200, j: true).db("test")
coll = db.collection("imieniny")
coll.count
#=> powinno zwrócić 364
coll.find_one
#=> powinno zwrócić { "day"=>1, "month"=>1, "names"=>"Mieszka Mieczysława Marii" }
```

Zaczynamy od zmiany formatu danych na:

```ruby
{ "date"=>"18/01", "names"=>["Piotra", "Małgorzaty"] }
```

Format zmienimy na konsoli *irb*:

```ruby
coll.find({}, {snapshot: true}).each do |doc|
  doc["names"] = doc["names"].split(" ")
  doc["date"] = "%02d/%02d" % [doc["day"], doc["month"]]
  doc.delete("day") ; doc.delete("month")
  coll.save(doc)
end
coll.count    #=> 364
coll.find_one
```


## Przykładowe agregacje

1\. Ile razy X obchodzi imieniny?

```ruby
puts coll.aggregate([
  {"$project" => { _id: 0, names: 1, date: 1}},
  {"$unwind"  => "$names"},
  {"$group" => { _id: "$names", count: {"$sum" => 1}}},
  {"$sort" => {count: 1}}
])
#=>
{"_id"=>"Piotra", "count"=>9}
{"_id"=>"Grzegorza", "count"=>9}
{"_id"=>"Marii", "count"=>16}
{"_id"=>"Jana", "count"=>21}
```

2\. Ile jest różnych imion?

```ruby
puts coll.aggregate([
  {"$project" => { _id: 0, names: 1}},
  {"$unwind" => "$names" },
  {"$group" => {_id: 0, total: {"$sum" => 1}}}
])
#=>
{"_id"=>0, "total"=>1022}
```
