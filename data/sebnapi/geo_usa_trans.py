from pymongo import MongoClient

client = MongoClient()
db = client.geo
coll = db.usa
new_coll = db.geo_usa2

cursor = coll.find()
cursor.batch_size(3300)

attrs = ["FEATURE_ID", "FEATURE_NAME", "FEATURE_CLASS", "STATE_ALPHA", "COUNTY_NAME"]

for entry in cursor:
    new_entry = {}
    for k,v in entry.items():
        if(k in attrs):
            new_entry[k] = v
    try:
        new_entry["ELEV_IN_M"] = float(entry["ELEV_IN_M"])
        if(float(entry["PRIM_LONG_DEC"]) != 0 and float(entry["PRIM_LAT_DEC"]) != 0):
            new_entry["loc"] = {"type":"Point", "coordinates": [float(entry["PRIM_LONG_DEC"]), float(entry["PRIM_LAT_DEC"])]}
    except ValueError:
        continue
    new_coll.save(new_entry)
            
    
