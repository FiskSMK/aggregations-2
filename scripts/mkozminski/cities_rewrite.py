#!/bin/env python
import csv
import json
import sys

inFile = open('data/mkozminski/cities.raw', 'r')
outFile = open('data/mkozminski/cities.json', 'w')

count = 1

reader = csv.reader(inFile)
for row in reader:
    entry = {}
    entry['_id'] = count
    entry['name'] = row[0]
    entry['loc'] = {}
    entry['loc']['type'] = 'Point'
    longitude = int(row[1]) + (int(row[2]) / 60)
    latitude = int(row[3]) + (int(row[4]) / 60)
    entry['loc']['coordinates'] = [latitude, longitude]
    json.dump(entry, outFile, indent=4, sort_keys=True, ensure_ascii=False)
    outFile.write('\n')
    count += 1