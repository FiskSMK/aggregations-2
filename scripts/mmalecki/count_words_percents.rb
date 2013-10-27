#!/usr/bin/env ruby

require 'rubygems'
require 'mongo'
require 'colorize'

class Numeric
  def percent_of(n)
    (self.to_f / n.to_f * 100.0).round(2)
  end
end

def sum_up_by_last_element(array, n)
  array.first(n).collect { |o| o["count"] }.inject(&:+)
end

if ARGV.size != 2
  puts "USAGE: ruby #{$0} db collection".red
  exit(1)
else
  db = ARGV[0].to_s
  collection = ARGV[1].to_s
end

include Mongo
cli = MongoClient.new.db(db).collection(collection);

all = cli.aggregate([
  {"$group" => {_id: "$word", count: {"$sum" => 1}}},
  {"$sort" => {count: -1}},
])

tops = all.first(1000)
count_all = all.collect { |o| o["count"] }.inject(&:+)

top = tops.first(1).first
sum_up_by_last_element(tops, 10)

puts "word/top,count,percent of all"
puts "#{top["_id"]},#{top["count"]},#{top["count"].percent_of(count_all)}%"
[10, 100, 1000].each do |n|
  sum = sum_up_by_last_element(tops, n.to_i)
  percents = sum.percent_of(count_all)
  puts "#{n},#{sum},#{percents}%"
end
