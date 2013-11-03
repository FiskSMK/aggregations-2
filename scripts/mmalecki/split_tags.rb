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

puts "db: #{db}, collection: #{collection}".green

include Mongo
cli = MongoClient.new.db(db).collection(collection);

docs_counter = 0
processed_docs = 0
tags_counter = 0
already_fixed = 0

cli.find.each do |doc|
  tags = doc["Tags"]

  # it may be a number
  if not tags.is_a? String and not tags.is_a? Array
    tags = tags.to_s
  end

  # if tags are string then proceed,
  # if not then skip as already proceeded
  if tags.is_a? String
    docs_counter += 1
    cli.update({"_id" => doc["_id"]}, {"$set" => {"Tags" => tags.split(' ')}})
  else
    already_fixed += 1
  end

  tags_counter += tags.size
  processed_docs += 1

  if processed_docs % 50000 == 0
    puts "Processed: #{processed_docs.to_s.yellow}, " \
         "Already fixed: #{already_fixed.to_s.green}, " \
         "Fixed: #{docs_counter.to_s.red}, " \
         "Tags: #{tags_counter.to_s.red}"
  end
end

puts "Docs updated: #{docs_counter.to_s.yellow}, " \
     "Number of tags: #{tags_counter.to_s.red}"
