# Train

## Preparing Raw Data

```
cat Train.csv | tr -d "\n" | tr "\r" "\n" > train_tr.csv
```

## First mongoimport

```
time mongoimport -d bzyl_nosql3 -c train  --type csv --file train_tr.csv --headerline
```

Result: Imported 6034195 objects in 48min
```
Fri Nov  1 23:42:39.952 check 9 6034196
Fri Nov  1 23:42:39.975 imported 6034195 objects
Fri Nov  1 23:42:39.995 [conn3] end connection 127.0.0.1:53967 (0 connections now open)

real	48m10.531s
user	4m1.650s
sys	27m56.483s
```

```
> db.stats()
{
	"db" : "bzyl_nosql3",
	"collections" : 3,
	"objects" : 6034199,
	"avgObjSize" : 1272.4801101190067,
	"dataSize" : 7678398208,
	"storageSize" : 8054607872,
	"numExtents" : 25,
	"indexes" : 1,
	"indexSize" : 195807024,
	"fileSize" : 12812550144,
	"nsSizeMB" : 16,
	"dataFileVersion" : {
		"major" : 4,
		"minor" : 5
	},
	"ok" : 1
}
```

```fileSize``` : Sum of the sizes of all files allocated for this database (e.g. test.0 + test.1 etc.), in GB
```
> db.stats().fileSize/1024/1024/1024
11.9326171875
```

```storageSize``` : dataSize plus all preallocated collection space, in GB
```
> db.stats().storageSize/1024/1024/1024
7.501438140869141
```

```dataSize``` : Sum of all actual data (BSON objects) used by the database, in GB
```
> db.stats().dataSize/1024/1024/1024
7.1510655879974365
```
```indexSize``` : Sum of all indexes used by the database, in GB
```
> db.stats().indexSize/1024/1024/1024
0.1823595017194748
```

But the problem was, that mongoimport imports a csv string field with digits
in it as a Number. To be sure we don't lose tags like "007" which would be
imported as "7" (this behaviour corresponds to the ticket https://jira.mongodb.org/browse/SERVER-3731) 
i wrote a [python script that imports the data](import_train_tr.py), measures the time and throughput.

## Second import by [python script](import_train_tr.py)

```
1.65722188295e-05 % - throughput: 0.0140412580318 MB/s
1.00000082861 % - throughput: 5.25802469152 MB/s
2.00000165722 % - throughput: 2.71941212749 MB/s
3.00000248583 % - throughput: 10.6116136875 MB/s
4.00000331444 % - throughput: 10.1143606229 MB/s
5.00000414305 % - throughput: 7.14382782585 MB/s
6.00000497167 % - throughput: 4.8111769198 MB/s
7.00000580028 % - throughput: 3.13171306501 MB/s
8.00000662889 % - throughput: 5.80626249425 MB/s
9.0000074575 % - throughput: 8.34565334741 MB/s
10.0000082861 % - throughput: 0.931093580469 MB/s
11.0000091147 % - throughput: 5.64815524172 MB/s
12.0000099433 % - throughput: 7.04468240877 MB/s
13.0000107719 % - throughput: 6.63579857504 MB/s
14.0000116006 % - throughput: 7.64134115917 MB/s
15.0000124292 % - throughput: 7.32840113389 MB/s
16.0000132578 % - throughput: 7.42404518651 MB/s
17.0000140864 % - throughput: 7.97282962918 MB/s
18.000014915 % - throughput: 0.79632861443 MB/s
19.0000157436 % - throughput: 7.28647803497 MB/s
20.0000165722 % - throughput: 7.45277560963 MB/s
21.0000008286 % - throughput: 7.17781350879 MB/s
22.0000016572 % - throughput: 6.94428878722 MB/s
23.0000024858 % - throughput: 6.64617061039 MB/s
24.0000033144 % - throughput: 3.51084969099 MB/s
25.0000041431 % - throughput: 7.84621561376 MB/s
26.0000049717 % - throughput: 7.65073013821 MB/s
27.0000058003 % - throughput: 7.34671913473 MB/s
28.0000066289 % - throughput: 7.74779376832 MB/s
29.0000074575 % - throughput: 3.54751559956 MB/s
30.0000082861 % - throughput: 6.77924245834 MB/s
31.0000091147 % - throughput: 6.7105117168 MB/s
32.0000099433 % - throughput: 6.49832239213 MB/s
33.0000107719 % - throughput: 6.63448828388 MB/s
34.0000116006 % - throughput: 6.26591722526 MB/s
35.0000124292 % - throughput: 3.35007708374 MB/s
36.0000132578 % - throughput: 6.15556982641 MB/s
37.0000140864 % - throughput: 6.54536708632 MB/s
38.000014915 % - throughput: 5.80273383474 MB/s
39.0000157436 % - throughput: 3.01043232166 MB/s
40.0000165722 % - throughput: 6.28145854159 MB/s
41.0000008286 % - throughput: 6.6167948282 MB/s
42.0000016572 % - throughput: 6.04869796925 MB/s
43.0000024858 % - throughput: 0.967319721387 MB/s
44.0000033144 % - throughput: 5.16617274381 MB/s
45.0000041431 % - throughput: 5.39692661892 MB/s
46.0000049717 % - throughput: 5.2335831751 MB/s
47.0000058003 % - throughput: 5.01547707797 MB/s
48.0000066289 % - throughput: 3.20379969069 MB/s
49.0000074575 % - throughput: 5.58177122707 MB/s
50.0000082861 % - throughput: 6.04407038586 MB/s
51.0000091147 % - throughput: 6.47464499584 MB/s
52.0000099433 % - throughput: 6.23609678329 MB/s
53.0000107719 % - throughput: 2.69457303999 MB/s
54.0000116006 % - throughput: 6.2908287763 MB/s
55.0000124292 % - throughput: 6.13340482847 MB/s
56.0000132578 % - throughput: 5.92165874439 MB/s
57.0000140864 % - throughput: 2.76167213985 MB/s
58.000014915 % - throughput: 1.48903948197 MB/s
59.0000157436 % - throughput: 1.99770046911 MB/s
60.0000165722 % - throughput: 6.62723345994 MB/s
61.0000008286 % - throughput: 6.10928299771 MB/s
62.0000016572 % - throughput: 3.79046666593 MB/s
63.0000024858 % - throughput: 5.82809639808 MB/s
64.0000033144 % - throughput: 5.45244157058 MB/s
65.0000041431 % - throughput: 5.67463957025 MB/s
66.0000049717 % - throughput: 5.5749041001 MB/s
67.0000058003 % - throughput: 3.3850203869 MB/s
68.0000066289 % - throughput: 6.1428537328 MB/s
69.0000074575 % - throughput: 6.11581094711 MB/s
70.0000082861 % - throughput: 6.47305159065 MB/s
71.0000091147 % - throughput: 6.3053326972 MB/s
72.0000099433 % - throughput: 3.85402200275 MB/s
73.0000107719 % - throughput: 6.63466200809 MB/s
74.0000116006 % - throughput: 6.45951155577 MB/s
75.0000124292 % - throughput: 6.12059143707 MB/s
76.0000132578 % - throughput: 6.63419626185 MB/s
77.0000140864 % - throughput: 3.50026194533 MB/s
78.000014915 % - throughput: 0.845772529778 MB/s
79.0000157436 % - throughput: 3.32930592197 MB/s
80.0000165722 % - throughput: 4.82556046182 MB/s
81.0000008286 % - throughput: 5.74842728449 MB/s
82.0000016572 % - throughput: 5.81474690106 MB/s
83.0000024858 % - throughput: 6.08845936449 MB/s
84.0000033144 % - throughput: 5.66714385014 MB/s
85.0000041431 % - throughput: 3.18050873317 MB/s
86.0000049717 % - throughput: 5.68335763655 MB/s
87.0000058003 % - throughput: 5.41886659811 MB/s
88.0000066289 % - throughput: 5.25521047122 MB/s
89.0000074575 % - throughput: 2.71896744607 MB/s
90.0000082861 % - throughput: 5.85361648907 MB/s
91.0000091147 % - throughput: 5.24453669456 MB/s
92.0000099433 % - throughput: 4.79591472172 MB/s
93.0000107719 % - throughput: 3.00343712399 MB/s
94.0000116006 % - throughput: 4.91919107979 MB/s
95.0000124292 % - throughput: 4.75036163548 MB/s
96.0000132578 % - throughput: 4.64650603242 MB/s
97.0000140864 % - throughput: 3.00460726595 MB/s
98.000014915 % - throughput: 4.80855542934 MB/s
99.0000157436 % - throughput: 4.5747822397 MB/s
Lines processed: 6034195.0 in 26.630832084 min
```


Total count of imported objects
```
> db.train.count()
6034195
```

## Changing Tags-String to a Tag-List

For this work I used also a [python script](zad1c.py).
It took 45min and shows it has 42048 distinct tags and 17409994 overall.

```
time python2.7 zad1c.py 
1.65722188295e-05 %
1.00000082861 %
2.00000165722 %
3.00000248583 %
4.00000331444 %
5.00000414305 %
...
95.0000124292 %
96.0000132578 %
97.0000140864 %
98.000014915 %
99.0000157436 %

 # Different tags: 42048
 # Overall tags: 17409994

real	45m27.829s
user	11m53.620s
sys	2m23.062s
```

##### Processor, memory, IO while changing

![tagging_pro_ram_io](../../images/sebnapi/tagging_pro_ram_io.png)

# Words 

I chosed a Bucket-Data-Model to have fast query times, for our use-cases.
Every tag is saved as an index with a quantity attribute. The import was done
by this [python script](mattmahoney.py). This script reads the file chunk by chunk while
upserting the tags to the database. Measueres the time and throughput.

```
1 % - throughput: 0.0206674060009 MB/s
2 % - throughput: 0.0230247523935 MB/s
3 % - throughput: 0.0247429020939 MB/s
4 % - throughput: 0.0246798366141 MB/s
5 % - throughput: 0.0245590211571 MB/s
6 % - throughput: 0.0245469322808 MB/s
7 % - throughput: 0.0245161261071 MB/s
8 % - throughput: 0.024856064295 MB/s
9 % - throughput: 0.024453741671 MB/s
10 % - throughput: 0.0257641718203 MB/s
11 % - throughput: 0.0254332184478 MB/s
12 % - throughput: 0.0258134940693 MB/s
13 % - throughput: 0.0259120498096 MB/s
14 % - throughput: 0.0269278548797 MB/s
15 % - throughput: 0.0250427264638 MB/s
16 % - throughput: 0.0236384082491 MB/s
17 % - throughput: 0.0234032561812 MB/s
18 % - throughput: 0.0250001507397 MB/s
19 % - throughput: 0.0233517054956 MB/s
20 % - throughput: 0.0228940204692 MB/s
21 % - throughput: 0.0205128728592 MB/s
22 % - throughput: 0.0234031843203 MB/s
...
88 % - throughput: 0.0252948535454 MB/s
89 % - throughput: 0.0257324755923 MB/s
90 % - throughput: 0.0255857540084 MB/s
91 % - throughput: 0.0255081608941 MB/s
92 % - throughput: 0.0255111513977 MB/s
93 % - throughput: 0.0251735405451 MB/s
94 % - throughput: 0.0250267518143 MB/s
95 % - throughput: 0.0254085392476 MB/s
Bytes processed: 99615000 in 65.836825633 min
```

## Count Tags

The script to calculate the 1, 10, 100, 1000 percentage is short and very fast:

```python
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
```

Output:
```
---	 count		 %
1 	 1061396 	 6.24%
10 	 4205965 	 24.73%
100 	 7998977 	 47.04%
1000 	 11433353 	 67.23%
all 	 17005206

real	0m2.922s
user	0m0.170s
sys	0m0.153s
```


# Geo-Stuff

I found a csv-file from the [Geographic Names Information System](https://geonames.usgs.gov/domestic/download_data.htm) with Geo-Coordinates in it, after failing to find a a bigger pure geojson file.

After importing it as usual I will create a new collection with the attributes:
```
["FEATURE_ID", "FEATURE_NAME", "FEATURE_CLASS", "STATE_ALPHA", "COUNTY_NAME", "ELEV_IN_M"]
```
and the coordinates of this point of interest with this [script](geo_usa_trans.py).

After transforming the entries and filtering the interesting fields we have 2179100 Geo-Entries to work with.

```
> db.geo_usa2.count()
2179100
```

One entry looks like this:

```javascript
> db.geo_usa2.findOne()
{
	"_id" : ObjectId("52772fc800d0b0afd0f5b4f6"),
	"ELEV_IN_M" : 1645,
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			-109.4784394,
			36.4611122
		]
	},
	"FEATURE_CLASS" : "Stream",
	"FEATURE_ID" : 399,
	"FEATURE_NAME" : "Agua Sal Creek",
	"COUNTY_NAME" : "Apache",
	"STATE_ALPHA" : "AZ"
}
```














