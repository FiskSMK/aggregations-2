#! /bin/env ruby

## Usage:
##
##                    lowercased
##                     |
##   ./json_stemmer.rb train.json > strain.json
##   ./json_stemmer.rb  test.json >  stest.json
##
##   mongoimport --drop -d kaggle -c strain strain.json
##   mongoimport --drop -d kaggle -c stest  stest.json

## ARGF, ARGV, STDIN:
##   http://stackoverflow.com/questions/273262/best-practices-with-stdin-in-ruby
## Ruby regular expressions:
##   http://doc.infosnel.nl/ruby_regular_expressions.html

require 'bundler/setup'

require "nokogiri"
require "oj"

require 'fast_stemmer'

def handle_json(row)
  hash = Oj.load(row)
  shash = { }
  shash["_id"] = hash["_id"]

  title = Nokogiri::HTML(hash["title"]).text.gsub(/[[:punct:]]/m, ' ').gsub(/\s+/m, ' ').strip.split(/\s+/)
  title.map! { |x| x.stem }
  shash["title"] = title.join(' ')

  body = Nokogiri::HTML(hash["body"]).text.gsub(/[[:punct:]]/m, ' ').gsub(/\s+/m, ' ').strip.split(/\s+/)
  body.map! { |x| x.stem }
  shash["body"] = body.join(' ')

  shash["tags"] = hash["tags"] if hash["tags"]

  shash["rnd"] = hash["rnd"]

  return Oj.dump(shash)
end

File.open(ARGV[0]).each_line do |line|
  puts handle_json(line)
end
