from pymongo import MongoClient
import time

class Throughput:
    def __init__(self):
        self.t = time.time()
        self.bytes = 0
            
    def get_throughput(self, bytes):
        t2 = time.time()
        time_delta = t2 - self.t
        self.t = t2
        throughput =  (bytes-self.bytes)/time_delta
        self.bytes = bytes
        return throughput

class SmartFileRead(object):
    def __init__(self, f):
        self.my_buffer = ""
        self.f = f
   
    def __iter__(self):
        return self
   
    def next(self):
        if(len(self.my_buffer) < 500):
            self.my_buffer += f.read(1000)
        i = self.my_buffer.find(" ")
        if(i == 0):
            self.my_buffer = self.my_buffer[1:]
            i = self.my_buffer.find(" ")
        if(i>0):
            word = self.my_buffer[:i]
            self.my_buffer = self.my_buffer[i+1:]
            return word
        else:
            raise StopIteration


time1 = time.time()

client = MongoClient()
db = client.mattmahoney
coll = db.words

with open("text8", "r") as f:
    sfr = SmartFileRead(f)
    thr = Throughput()
    t=0
    for word in sfr:
        coll.update({'_id': word}, {'$inc': {'quantity': 1}}, upsert=True)
        per = f.tell()*100/(100*1024*1024)
        if( per > t):
            t += 1
            print "%s %% - throughput: %s MB/s" % (per, thr.get_throughput(f.tell())/1024/1024)

time2 = time.time()

print "Bytes processed: %s in %s min" % (thr.bytes, (time2-time1)/60.0)    

words_overall = coll.count()
words = coll.find().sort([("quantity", -1)]).limit(1000)

q1 = words.next().get("quantity")

import pdb
pdb.set_trace()
