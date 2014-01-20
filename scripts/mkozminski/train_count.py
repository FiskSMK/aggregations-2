#!/bin/env python
import pymongo

from pymongo import MongoClient
client = MongoClient()
db = client.test
train = db.train

allEntries = train.find(snapshot=True)

tagsCount = 0
allTags = {}

def countTags(allTags):
    count = 0
    for tag in allTags:
        count += allTags[tag]
    return count

print('Counting...')
for entry in allEntries:
    for tag in entry['tags']:
        val = allTags.get(tag, 0)
        if val == 0:
            allTags[tag] = 1
        else:
            allTags[tag] += 1
print('Done.')
print('All tags: ' + str(countTags(allTags)))
print('Unique tags: ' + str(len(allTags)))
allEntries.close();