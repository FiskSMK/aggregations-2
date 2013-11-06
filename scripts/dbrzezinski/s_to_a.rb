require 'mongo'
include Mongo

coll = MongoClient.new("localhost", 27017).db("train").collection("questions")

coll.find.each do |record|
  tags = record['tags']
  tags = tags.to_s unless tags.is_a? String or tags.is_a? Array
  coll.update({ "_id" => record['_id'] }, { "$set" => { "tags" => tags.split(" ") } }) if tags.is_a? String
end

data = coll.aggregate([
  { "$unwind" => "$tags" },
  { "$group" => { _id: "$tags", number: { "$sum" => 1 } } }
])

all_tags = data.map{|e| e["number"]}.reduce(:+)
diff_tags = data.count

puts "All tags: #{all_tags}"
puts "Different tags: #{diff_tags}"