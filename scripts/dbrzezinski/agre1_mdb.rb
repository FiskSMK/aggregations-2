
require 'mongo'
include Mongo

coll = MongoClient.new("localhost", 27017).db("gdelt").collection("events")

data = coll.aggregate([
  { "$group" => { _id: "$EventCode", number: { "$sum" => 1 } } }
])

all_events = data.map{|e| e["number"]}.reduce(:+)
diff_events = data.count

puts "Wszystkie eventy: #{all_events}"
puts "Różne eventy: #{diff_events}"
