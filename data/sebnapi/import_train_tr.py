import csv, pymongo, time

class Throughput:
    def __init__(self):
        self.t = time.time()
        self.bytes = 0
    
    def trigger(self, bytes):
        self.bytes += bytes
            
    def get_throughput(self):
        t2 = time.time()
        time_delta = t2 - self.t
        self.t = t2
        throughput =  self.bytes/time_delta
        self.bytes = 0
        return throughput

time1 = time.time()

connection = pymongo.Connection()
collection = connection.nosql_bzyl.train
reader = csv.DictReader(open('train_tr.csv'))


t=0
i=float(0)
thr = Throughput()
for line in reader:
    thr.trigger(len("".join(line.values())))
    i += 1
    per = (i/6034195)*100
    if(per > t):
        t += 1
        print "%s %% - throughput: %s MB/s" % (per, thr.get_throughput()/1024/1024)
    _id = line.pop("Id")
    line.update({"_id":_id})
    collection.save(line)


time2 = time.time()

print "Lines processed: %s in %s min" % (i, (time2-time1)/60.0)

