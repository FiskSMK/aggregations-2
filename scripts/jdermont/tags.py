#!/bin/env python2
# 'brzydki' skrypt do zadania 1c
from pymongo import MongoClient
c = MongoClient()
collection = c.baza.train.find()

l = 0;
for i in collection:
  l += 1
  if l&65535 == 0: print l
  iid = i['Id']
  if not isinstance(i['Tags'], basestring): continue 
  tagi = i['Tags'].split()
  c.baza.train.update({"Id":iid},{"$set":{"Tags":tagi}}, j=False)
