#!/usr/bin/env ruby

require 'rubygems'
require 'mongo'
require 'colorize'

if ARGV.size != 2
  puts "USAGE: ruby #{$0} db collection".red
  exit(1)
else
  db = ARGV[0].to_s
  collection = ARGV[1].to_s
end

include Mongo
cli = MongoClient.new.db(db).collection(collection);

tags = cli.aggregate([
  {"$project" => {Tags: 1, _id: 0}},
  {"$unwind" => "$Tags"},
  {"$group" => {_id: "$Tags", count: {"$sum" => 1}}},
  {"$sort" => {count: -1}}
])

all_tags = tags.collect { |o| o["count"] }.inject(&:+)

puts "All tags,#{all_tags}"
tags.each do |tag|
  puts "#{tag["_id"]},#{tag["count"]}"
end
