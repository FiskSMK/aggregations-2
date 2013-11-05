#Zadanie 1a 

```sh
	cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n -1 > Train2.csv
```

Import na Winowsie. Mierzenie czasu w PowerShellu.

```sh
	Measure-Command { mongoimport -d train -c train --type csv --headerline --file Train2.csv }
```

output:

```sh
	Days              : 0
	Hours             : 0
	Minutes           : 20
	Seconds           : 0
	Milliseconds      : 887
	Ticks             : 12008873953
	TotalDays         : 0,0138991596678241
	TotalHours        : 0,333579832027778
	TotalMinutes      : 20,0147899216667
	TotalSeconds      : 1200,8873953
	TotalMilliseconds : 1200887,3953
```

#Zadanie 1b

```sh
	PS C:\mongo> mongo
	MongoDB shell version: 2.4.6
	connecting to: test
	> use train
	switched to db train
	> db.train.count()
	6034195
	>
	bye
```

#Zadanie 1c

```ruby
	require 'mongo'

	include Mongo

	mongo_client = MongoClient.new("localhost", 27017)
	db = mongo_client.db("train")
	coll = db.collection("train")

	tags_count = Array.new { Hash.new }

	coll.find.each do |row|
		tags0 = row["Tags"]
		unless tags0.class == String
			tags0 = tags0.to_s
		end
		tags_array = row["Tags"].split(' ')
		tags_str = "{"
		tags_array.each do |tag|
			tags_str += tag
			match = tags_count.find {|h| h.member? tag }
			unless match
				tags_count << {tag: 1}
			else
				tags_count[tag] += 1
			end
		end
		tags_str = tags_str[0..-1]
		tags_str += }
		row["Tags"] = tags_str
		coll.save(row)
	end
	puts tags_array.to_s
```
