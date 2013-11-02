#!/bin/env python
import pymongo
from pymongo import MongoClient

client = MongoClient()
db = client.test
trains = db.Train
print(trains.find_one())