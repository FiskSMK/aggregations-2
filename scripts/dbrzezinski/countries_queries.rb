require 'mongo'
include Mongo

@coll = MongoClient.new("localhost", 27017).db("train").collection("countries")

polygon_in_central_europe = {
  "type" => "Polygon",
  "coordinates" => [
    [ [10.5029296875,54.18815548107151], [7.207031249999999,53.77468884583577], [5.8447265625,51.09662294502995], [7.778320312499999,48.28319289548349], [10.986328125,46.195042108660154], [16.69921875,45.767522962149904], [27.158203125,47.81315451752768], [27.861328125,51.536085601784755], [24.78515625,54.95238569063361], [22.060546874999996,55.89995614406812], [10.5029296875,54.18815548107151] ]
  ]
}

slowackiego25_gdansk = {
  "type" => "Point",
  "name" => "ul. Słowackiego 25",
  "coordinates" => [
    18.587509989738464,
    54.38076044313717
  ]
}

line_central_europe = {
  "type" => "LineString",
  "coordinates" => [
    [ 5.44921875, 51.890053935216926 ],
    [ 26.1474609375, 55.801280971180454 ]
  ]
}

def find_within(polygon)
  puts "* Within:\n"
  @coll.find({
    "geometry" => {
      "$geoWithin" => {
        "$geometry" => polygon
      }
    }
  }).to_a.each {|e| puts "#{e["properties"]["name"]}\n"}
  puts "***\n\n"
end

def find_intersects(polygon)
  puts "* Intersects:\n"
  @coll.find({
    "geometry" => {
      "$geoIntersects" => { 
        "$geometry" => polygon 
      }
    }
  }).to_a.each {|e| puts "#{e["properties"]["name"]}\n"}
  puts "***\n\n"
end

def find_near(point, with = false)
  data = @coll.find({
    "geometry" => {
      "$near" => {
        "$geometry" => point,
        "$maxDistance" => 1000000 # because value must be in meters
      }
    }
  })
  if with
    puts "* Countries near 1000 km from #{point["name"]} with country place belongs to\n"
  else
    data = data.skip(1) 
    puts "* Countries near 1000 km from #{point["name"]}\n"
  end
  data.to_a.each {|e| puts "#{e["properties"]["name"]}\n"}
  puts "***\n\n"
end

def country_point_belongs_to(point)
  data = @coll.find({
    "geometry" => {
      "$near" => {
        "$geometry" => point
      }
    }
  }).to_a[0]
  puts "#{data["properties"]["name"]}\n"
end

def find_countries_on_line(line)
  data = @coll.find({
    "geometry" => {
      "$geoIntersects" => { 
        "$geometry" => line
      }
    }
  }).to_a
  puts "*#{data.count} countries on line:\n"
  data.each {|e| puts "#{e["properties"]["name"]}\n"}
  puts "***\n\n"
end

find_within polygon_in_central_europe
find_intersects polygon_in_central_europe
find_near slowackiego25_gdansk, false
find_near slowackiego25_gdansk, true
country_point_belongs_to slowackiego25_gdansk
find_countries_on_line line_central_europe 