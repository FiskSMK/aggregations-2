#! /bin/env ruby

## Usage:
##
##   tail -n +2 Train.csv | tr -d "\r" > Train2.csv
##   tail -n +2 Test.csv  | tr -d "\r" > Test2.csv
##
##   ./lowercase.perl < Train2.csv > Train3.csv
##   ./lowercase.perl < Test2.csv > Test3.csv
##
##   ./csv2json.rb Train3.csv > train.json
##   ./csv2json.rb Test3.csv  > test.json
##
##   mongoimport --drop -d kaggle -c train train.json
##   mongoimport --drop -d kaggle -c test  test.json
##
##?  rm Train{2,3}.csv
##?  rm Test{2,3}.csv

## ARGF, ARGV, STDIN:
##   http://stackoverflow.com/questions/273262/best-practices-with-stdin-in-ruby
## Ruby regular expressions:
##   http://doc.infosnel.nl/ruby_regular_expressions.html

require 'bundler/setup'

require "nokogiri"
require "oj"

require "csv"

def handle_csv(row)
  hash = { }
  hash["_id"] = row[0].to_i
  hash["title"] = Nokogiri::HTML(row[1]).text.gsub(/[[:punct:]]/m, ' ').gsub(/\s+/m, ' ').strip
  hash["body"] = Nokogiri::HTML(row[2]).text.gsub(/[[:punct:]]/m, ' ').gsub(/\s+/m, ' ').strip
  hash["tags"] = row[3].split(/\s+/) if row[3]
  hash["rnd"] = Random.rand
  return Oj.dump(hash)
end

CSV.foreach(ARGV[0]) do |row|
  puts handle_csv(row)
end

__END__

CSV.foreach("./two.csv") do |row|
  puts handle_csv(row)
end

puts "-"*44

CSV.foreach("./twotwo.csv") do |row|
  puts handle_csv(row)
end

a = IO.read("doroszewski.txt").split(/\s+/)
a.each_cons(20) do |batch|
  puts batch.join(" ")
end
