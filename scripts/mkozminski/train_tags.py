#!/bin/env python
import pymongo

from pymongo import MongoClient
client = MongoClient()
db = client.test
train = db.train

allEntries = train.find()

print('Transforming...')
for entry in allEntries:
    newTags = []
    if (isinstance(entry['tags'], str) or isinstance(entry['tags'], unicode)):
        newTags = entry['tags'].split()
    else:
        newTags.append(str(entry['tags']));
    train.update({'_id': entry['_id']}, {'$set': {'tags': newTags}})
allEntries.close()
print('Done.')