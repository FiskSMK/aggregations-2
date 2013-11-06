from pymongo import MongoClient
import pickle

client = MongoClient()
db = client.nosql_bzyl
coll = db.train

tag_set = set()
tag_count = 0

t=0
i=float(0)

cursor = coll.find()
cursor.batch_size(3300)

for entry in cursor:
    
    i += 1
    per = (i/6034195)*100
    if(per > t):
        t += 1
        print "%s %%" % (per)
    
    try:
        objid =  entry.get("_id")
        tags = entry.get("Tags")
        
        if(type(tags) == type(u"")):
            entry_tags = tags.split(" ")
            entry.update({'Tags': entry_tags})
        
            coll.update({'_id': objid},entry)
        tag_set.update(tags)
        tag_count += len(tags)
    except:
        import pdb
        pdb.set_trace()
    

print " # Different tags: %s" % (len(tag_set))
print " # Overall tags: %s" % (tag_count)


with open('diff_tags.pkl', 'wb') as output:
    pickle.dump(list(tag_set), output)