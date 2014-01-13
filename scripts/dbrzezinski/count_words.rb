require 'mongo'
include Mongo

# http://stackoverflow.com/questions/3668345/calculate-percentage-in-ruby
class Numeric
  def percent_of(n)
    (self.to_f / n.to_f * 100.0).round(1)
  end
end

def reduce(array)
  array.map{|e| e["number"]}.reduce(:+)
end

coll = MongoClient.new("localhost", 27017).db("train").collection("words")

File.open('text8.txt', 'r').each_line do |line|
  if line.length > 1
    word = line.delete("\n")
    coll.insert({ body: word })
  end
end

data = coll.aggregate([
  { "$group" => { _id: "$body", number: { "$sum" => 1 } } },
  { "$sort" => { number: -1 } }
])

all_words = reduce(data)
mcw = data[0]

puts "All words: #{all_words}"
puts "Different words: #{data.count}"

puts "***"

puts "The most common word is '#{mcw["_id"]}' with #{mcw["number"].percent_of(all_words)}%"
[10, 100, 1000].each { |max| puts "For first #{max} words: #{reduce(data[0..max]).percent_of(all_words)}%" }