#!/bin/env python
import pymongo
import json
from pymongo import MongoClient

db = MongoClient().nosql_db

#--------------------------------------------
#Geo point near defined point
fields = {"_id":0,"name":1, "loc":1}
query = {"loc" :{"$near" :{"$geometry" :{"type" : "Point","coordinates" : [-118.40192,34.06990]}}}}
near = db.allstates_geo.find(query, fields=fields).limit(1)
geo = '{ "type": "FeatureCollection","features": [{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(query["loc"]["$near"]["$geometry"]["coordinates"]) + '},"properties": {"Punkt": "Punkt Odniesienia"}},'
for item in near:
	print(item)
	geo += '{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(item["loc"]["coordinates"]) + '},"properties": {"Punkt": "' + item["name"] +'"}},'
geo = geo[:-1] + ' ]}'
print(geo)
f = open("geo_near.json", "w")
f.write(geo)
f.close()

#--------------------------------------------
#Geo points within circle
# fields = {"_id":0,"name":1, "loc":1}
# query = { "loc" : { "$geoWithin" :{ "$center" : [[-73.96531, 40.78271], 0.1]}},"type" : "Building"}
# in_circle = db.allstates_geo.find(query, fields = fields).limit(10)
# geo = '{ "type": "FeatureCollection","features": [{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(query["loc"]["$geoWithin"]["$center"][0]) + '},"properties": {"Punkt": "Punkt Odniesienia"}},'
# for item in in_circle:
	# geo += '{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(item["loc"]["coordinates"]) + '},"properties": {"Punkt": "' + item["name"] +'"}},'
# geo = geo[:-1] + ' ]}'
# f = open("geo_within_circle.json", "w")
# f.write(geo)
# f.close()

#--------------------------------------------
#Geo points within polygon
# fields = {"_id":0,"name":1, "loc":1}
# query = { "loc": { "$geoWithin": { "$geometry": {"type": "Polygon","coordinates": [[ [-77.05014, 38.90251], [-77.02705, 38.90251], [-77.02700, 38.88757], [-77.05016, 38.88713], [-77.05014, 38.90251] ]] }}},"type": "Park"}
# in_polygon = db.allstates_geo.find(query, fields = fields)
# geo = '{ "type": "FeatureCollection","features": [{"type": "Feature","geometry": {"type": "Polygon","coordinates": ' + str(query["loc"]["$geoWithin"]["$geometry"]["coordinates"]) + '},"properties": {"Polygon": "Strefa Ograniczenia"}},'
# for item in in_polygon:
	# geo += '{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(item["loc"]["coordinates"]) + '},"properties": {"Punkt": "' + item["name"] +'"}},'
# geo = geo[:-1] + ' ]}'
# f = open("geo_within_polygon.json", "w")
# f.write(geo)
# f.close()

#--------------------------------------------
#Geo points intersects with polygon
# fields = {"_id":0,"name":1, "loc":1}
# query = {"loc" :{ "$geoIntersects" :{ "$geometry" :{"type" : "Polygon","coordinates" : [[ [-83.05806, 42.36855], [-83.09915, 42.35017], [-83.07857, 42.31772], [-83.03557, 42.33208], [-83.05806, 42.36855]	]]}}},"type" : "Building"}
# intersects = db.allstates_geo.find(query)
# geo = '{ "type": "FeatureCollection","features": [{"type": "Feature","geometry": {"type": "Polygon","coordinates": ' + str(query["loc"]["$geoIntersects"]["$geometry"]["coordinates"]) + '},"properties": {"Polygon": "Strefa Ograniczenia"}},'
# for item in intersects:
	# geo += '{"type": "Feature","geometry": {"type": "Point","coordinates": ' + str(item["loc"]["coordinates"]) + '},"properties": {"Punkt": "' + item["name"] +'"}},'
# geo = geo[:-1] + ' ]}'
# f = open("geo_intersects.json", "w")
# f.write(geo)
# f.close()
