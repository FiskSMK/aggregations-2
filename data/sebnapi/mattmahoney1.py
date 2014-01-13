from pymongo import MongoClient

client = MongoClient()
db = client.mattmahoney
coll = db.words

words_overall = coll.aggregate([
  {'$group' : {'_id' : 'sum',
      "total" : { '$sum' : '$quantity' },
      "count" : { '$sum' : 1 }
    }
  }
])["result"][0]


q1 = sum([i.get("quantity") for i in coll.find().sort([("quantity", -1)]).limit(1)])
q2 = sum([i.get("quantity") for i in coll.find().sort([("quantity", -1)]).limit(10)])
q3 = sum([i.get("quantity") for i in coll.find().sort([("quantity", -1)]).limit(100)])
q4 = sum([i.get("quantity") for i in coll.find().sort([("quantity", -1)]).limit(1000)])

print "---\t count\t\t %"
print "1 \t %s \t %.02f%%" % (q1, float(q1)*100/words_overall.get("total"))
print "10 \t %s \t %.02f%%" % (q2, float(q2)*100/words_overall.get("total"))
print "100 \t %s \t %.02f%%" % (q3, float(q3)*100/words_overall.get("total"))
print "1000 \t %s \t %.02f%%" % (q4, float(q4)*100/words_overall.get("total"))
print "all \t %s" % (words_overall.get("total"))