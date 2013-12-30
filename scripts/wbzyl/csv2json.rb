#! /bin/env ruby

## ARGF, ARGV, STDIN:
##   http://stackoverflow.com/questions/273262/best-practices-with-stdin-in-ruby
## Ruby regular expressions:
##   http://doc.infosnel.nl/ruby_regular_expressions.html

require 'bundler/setup'

require "nokogiri"
require "oj"

require "csv"

# http://www.ruby-doc.org/ruby-1.9/classes/Logger.html
# require 'logger'
# logger = Logger.new(STDERR)
# logger.level = Logger::INFO  # set the default level: INFO, WARN

# English stopwords from Tracker, http://projects.gnome.org/tracker/
# GitHub: git clone git://git.gnome.org/tracker ; cd data/languages/

# STOP = IO.read('stopwords.en').split("\n")
# logger.info "liczba wczytanych stopwords: #{STOP.length}"

unless ARGV.any?
  puts "Usage: ./csv2json.rb CSV_FILE > FILE"
  puts "       ./csv2json.rb Train.csv > Train.json"
  puts "       ./csv2json.rb Train.csv | mongoimport --drop --type json -d kaggle -c fb"
  exit 1
end

def handle_csv(row)
  hash = Hash.new

  hash["_id"] = row[0].to_i

  title = Nokogiri::HTML(row[1]).
    text.
    gsub(/[[:space:]]+/m, ' ').
    strip.
    downcase

  body = Nokogiri::HTML(row[2]).text.
    # gsub(/https?:[^ ]+/, ' '). # remove normal url
    # gsub(/[0-9]+/m, ' n ').    # spell numbers as n
    gsub(/[[:space:]]+/m, ' ').
    strip.
    downcase
  
  hash["title"] = title
  hash["body"] = body

  words = (body + " " + title).split(" ").to_a.sort
 
  tf = Hash.new(0)
  words.each do |word| 
    tf[word] += 1
  end
  max = tf.values.max.to_f

  tf.each do |k,v| 
    tf[k] = v/max
  end
  
  hash["tf"] = tf

  # hash["tags"] = row[3].split(/\s+/).map(&:downcase) if row[3]
  hash["tags"] = row[3].split(" ") if row[3]

  return Oj.dump(hash)
end

CSV.foreach(ARGV[0], headers: true) do |row|
  puts handle_csv(row)
end

__END__

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

a = IO.read("doroszewski.txt").split(/\s+/)
a.each_cons(20) do |batch|
  puts batch.join(" ")
end
