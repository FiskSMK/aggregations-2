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
