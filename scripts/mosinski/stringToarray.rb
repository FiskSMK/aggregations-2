#!/usr/bin/env ruby
# encoding: UTF-8

require 'rubygems'
require 'mongo'

unless ARGV[0] and ARGV[1]
  puts "Niepoprawne użycie skryptu"
  puts "Sposób użycia: ruby stringToarray.rb <baza> <kolekcja>"
  exit
else
  baza = ARGV[0].to_s
  kolekcja = ARGV[1].to_s
end

include Mongo
klient = MongoClient.new.db(baza).collection(kolekcja);
tagi_licznik = 0;

klient.find.each do |wiersz|
  tagi = wiersz["tags"]
  
  if tagi.kind_of? String
     klient.update({"_id" => wiersz["_id"]}, {"$set" => {"tags" => tagi.split(' ')} })
  end
  tagi_licznik += tagi.size  
end

tagi_rozne = klient.distinct('tags')

puts "Wszystkich tagów: #{tagi_licznik}"
puts "Różnych tagów: #{tagi_rozne.count}"
