
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

## Second import







