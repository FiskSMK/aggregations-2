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

words = cli.aggregate([
  {"$project" => {word: 1, _id: 0}},
  {"$group" => {_id: "$word", count: {"$sum" => 1}}},
  {"$sort" => {count: -1}}
])

all_words = words.collect { |o| o["count"] }.inject(&:+)

puts "All words,#{all_words}"
words.each do |word|
  puts "#{word["_id"]},#{word["count"]}"
end
