#!/bin/env python
import pymongo
from pymongo import MongoClient

db = MongoClient().test
trains = db.Train
#print(trains.find_one())
all = trains.find(timeout=False)
#i = 0
# Item with _id 6730 tags 3.0
for item in all:
    #i+=1
    print(item['_id'])
    print(item['tags'])
    if not isinstance(item['tags'], str): continue
    tagi = item['tags'].split()
    print(tagi)
    db.Train.update({'_id': item['_id']},{'$set':{'tags': tagi}},j=False)
all.close()