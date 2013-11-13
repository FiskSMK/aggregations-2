#!/bin/env python
import pymongo

from pymongo import MongoClient
client = MongoClient()
db = client.test
train = db.train

allEntries = train.find()
entriesCount = train.count()

tagsCount = 0
updateCount = 0
allTags = {}

def countTags(allTags):
    count = 0
    for tag in allTags:
        count += allTags[tag]
    return count

print('Transforming...')
for entry in allEntries:
    newTags = []
    if entry['_id'] % 10000 == 0:
        print(str(entry['_id']) + ' / ' + str(entriesCount))
    if (isinstance(entry['tags'], str) or isinstance(entry['tags'], unicode)):
        newTags = entry['tags'].split()
    else:
        newTags.append(str(entry['tags']));
    for tag in newTags:
        val = allTags.get(tag, 0)
        if val == 0:
            allTags[tag] = 1
        else:
            allTags[tag] += 1
    train.update({'_id': entry['_id']}, {'$set': {'tags': newTags}})
    updateCount += 1
print('All tags: ' + str(countTags(allTags)))
print('Unique tags: ' + str(len(allTags)))
print('Updates made: ' + str(updateCount))
allEntries.close();