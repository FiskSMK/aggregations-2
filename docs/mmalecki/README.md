# System info

## MongoDB version

```bash
MongoDB shell version: 2.4.7
```

## Drive

SSD Sata III drive was used during the tests.

# Table of content

@@TOC@@

## TL;DR

* 1a

  ```bash
  $ time bash prepare_data.bash Train.csv prepared_train.csv
  ```

* 1b

  ```bash
  $ time bash import_csv.bash nosql_course trains prepared_train.csv
  ```

* 1c

  ```bash
  $ time ruby split_tags.rb nosql_course trains

  # Print number of occuration for each tag
  $ time ruby count_tags.rb nosql_course trains

  # Print number of different tags
  MongoDB Shell > db.train.distinct("Tags").length
  ```

* 1d

  ```bash
  # Early EDA:

  wget http://mattmahoney.net/dc/text8.zip -O text8.gz
  tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt
  ls -l deleted.txt
  # should be: -rw-rw-r--. 1 wbzyl wbzyl 0 10-16 12:58 deleted.txt
  rm deleted.txt
  wc text8
  # should be: 0         17005207 100000000 text8
  tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
  wc text8.txt
  # should be: 17005207  17005207 100000000 text8.txt  # powtórzone 17005207 -> OK
  ```

  ```bash
  # Preparing for mongoimport

  # remove first blank line, add word header and save as csv
  sed 1d text8.txt | sed '1s/^/word\n/' > text8.csv
  ```

  ```bash
  # Import

  $ time bash import_csv.bash nosql_course text8 text8.csv
  ```

  ```bash
  # Count words

  $ time ruby count_words.rb nosql_course text8
  ```

  ```bash
  # Count percents...

  $ time ruby count_words_percents.rb nosql_course text8
  ```

* 1e

  ```bash
  # Get db

  wget http://geonames.usgs.gov/docs/stategaz/AllStates_20131020.zip
  ```

  ```bash
  # Early EDA

  $ time bash prepare_geo_data.bash AllStates data.csv
  ```

  ```bash
  # Import

  $ time bash import_csv.bash nosql_course allstates AllStates/data.csv
  ```

  ```bash
  # Making points from ltg/lng fields

  $ time ruby make_geo_points.bash nosql_course allstates
  ```

## Starting separated MongoDB cluster

```bash
mongod --fork --logpath path_to_logs --smallfiles --nojournal --dbpath path_to_cluster
```

# Train

## Preparing data

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time bash prepare_data.bash ../../data/mmalecki/tmp/Train.csv ../../data/mmalecki/tmp/prepared_train.csv

 real  2m2.507s
 user  0m32.282s
 sys   0m22.363s
```

## Importing prepared data from csv to mongodb

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time bash import_csv.bash nosql_course trains ../../data/mmalecki/tmp/prepared_train.csv 

 # check link below for output from importing

 Thu Oct 24 11:54:52.520 check 9 6034196
 Thu Oct 24 11:54:52.520 imported 6034195 objects

 real  4m48.196s
 user  3m8.919s
 sys   0m36.793s
```

[check importing output](importing_output.txt)

#### Resources while importing:

##### Disk io

![iotop](../../images/mmalecki/iotop.png)

##### Processor and memory

![htop](../../images/mmalecki/htop.png)

## Converting tags from string to array

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki) 
 $ time ruby split_tags.rb nosql_course trains
 db: nosql_course, collection: trains

 [...]

 real  63m21.708s
 user  38m58.566s
 sys   5m19.826s
```

Why so slow? because `split_tags.rb` is not multi-thread script ;).
Ofcourse it is possible to re-write it and use more threads.

## Counting tags

### Show number of occuration of each tag

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki) 
 $ time ruby count_tags.rb nosql_course trains

# check link below for tags

 real  7m8.077s
 user  4m28.623s
 sys   0m26.720s
```

[check number of occurration of the each tag](../../data/mmalecki/tags.csv)

### Show number of different tags in MongoDB Shell

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ mongo

 MongoDB shell version: 2.4.7
 connecting to: nosql_course
 > db.train.distinct("Tags").length
 42048
```

## MMS Monitoring

#### 1a - 1c

![mms-monitoring-status](../../images/mmalecki/mms-status.png)
![mms-monitoring-db-stats](../../images/mmalecki/mms-db-stats.png)

# Text8

## Early EDA:

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ wget http://mattmahoney.net/dc/text8.zip -O text8.gz

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ ls -l deleted.txt
 # should be: -rw-rw-r--. 1 wbzyl wbzyl 0 10-16 12:58 deleted.txt

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ rm deleted.txt

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ wc text8
 # should be: 0         17005207 100000000 text8

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt

~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ wc text8.txt
 # should be: 17005207  17005207 100000000 text8.txt  # powtórzone 17005207 -> OK
```

## Preparing for mongoimport

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ sed 1d text8.txt | sed '1s/^/word\n/' > text8.csv
 # remove first blank line, add word header and save as csv
```

## Import to MongoDB

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time bash import_csv.bash nosql_course text8 text8.csv

 real 5m9.878s
 user 0m47.601s
 sys  0m9.228s
```

## Counting words

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time ruby count_words.rb nosql_course text8

 # check link below for numbers

 real  0m25.927s
 user  0m1.419s
 sys   0m0.112s
```

[check number of occurration of each word](../../data/mmalecki/text8.csv)

## Counting "percents of"

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time ruby count_words_percents.rb nosql_course text8

 # check link below for numbers

 real  0m16.998s
 user  0m0.937s
 sys   0m0.072s
```

[check number of occurration of "tops"](../../data/mmalecki/text8_percents.csv)

### Show number of different words in MongoDB Shell

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ mongo

 MongoDB shell version: 2.4.7
 connecting to: nosql_course
 > db.text8.distinct("word").length
 253854
```

## MMS Monitoring

#### 1d

##### Importing

![mms-monitoring-text8-status](../../images/mmalecki/mms-status-text8.png)

##### Counting...

![mms-monitoring-text8-status](../../images/mmalecki/mms-status-text8-counting.png)

# Geo data

## Info

This is database of "Domestic and Antarctic Names - State and Topical Gazetteer"
provided by usgs.gov.

### Sample document (after EDA)

```json
{
  "COUNTY_NAME" : "Fairbanks North Star",
  "COUNTY_NUMERIC" : 90,
  "DATE_CREATED" : "01/01/2000",
  "DATE_EDITED" : "",
  "ELEV_IN_FT" : 440,
  "ELEV_IN_M" : 134,
  "FEATURE_CLASS" : "School",
  "FEATURE_ID" : 1397645,
  "FEATURE_NAME" : "Barnette School",
  "MAP_NAME" : "Fairbanks D-2",
  "PRIMARY_LAT_DMS" : "645019N",
  "PRIM_LAT_DEC" : 64.8386111,
  "PRIM_LONG_DEC" : -147.7275,
  "PRIM_LONG_DMS" : "1474339W",
  "SOURCE_LAT_DEC" : "",
  "SOURCE_LAT_DMS" : "",
  "SOURCE_LONG_DEC" : "",
  "SOURCE_LONG_DMS" : "",
  "STATE_ALPHA" : "AK",
  "STATE_NUMERIC" : 2,
  "_id" : ObjectId("526d0d807c0652b0b3a43c4d")
  }
}
```

## Download and decompress the database

It is small database.... it is so hard to find bigdata geo db :/

```bash
wget http://geonames.usgs.gov/docs/stategaz/AllStates_20131020.zip
unzip AllStates_20131020
```

## Early EDA

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time bash prepare_geo_data.bash ../../mmalecki/data/AllStates/ data.csv

 real  0m13.503s
 user  0m17.433s
 sys   0m1.875s
```

## Import to MongoDB

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time bash import_csv.bash nosql_course allstates ../../data/mmalecki/tmp/AllStates/data.csv

 # check link below for output from importing

 Sun Oct 27 00:11:13.198 check 9 6793101
 Sun Oct 27 00:11:13.275 imported 6793100 objects

 real  3m7.304s
 user  1m41.477s
 sys   0m6.826s
```

## Creating mongo points from lat/lng fields

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ time ruby make_geo_points.bash nosql_course allstates

 real  98m20.389s
 user  73m31.141s
 sys   9m56.322s
```

Done in parallel in 2-4 processes at the same time.
Number of processes at the same time depend on heat
(scale down and up manually).
Check the screens from MMS for visualization.

Additionaly script removes docs with incorrect coordinates.

## Adding indexes

```bash
~/repos/aggregations-2/scripts/mmalecki (maciej-malecki)
 $ mongo nosql_course
MongoDB shell version: 2.4.8
connecting to: nosql_course
> db.allstates.ensureIndex({'loc' : '2dsphere'})
```

## Geo queries

### Unfortunately in db exists duplicated docs!

ToDo: remove them!

### Near:

Point near the coordinates

```bash
> db.allstates.findOne(
  {
    loc :
    { $near :
      { $geometry :
        {
          type : "Point",
          coordinates : [-147.7209857, 64.8391607]
        }
      },
      $maxDistance : 1
    }
  })
```

```json
{
  "COUNTY_NAME" : "Fairbanks North Star",
  "COUNTY_NUMERIC" : 90,
  "DATE_CREATED" : "12/21/2012",
  "DATE_EDITED" : "01/08/2013",
  "ELEV_IN_FT" : 443,
  "ELEV_IN_M" : 135,
  "FEATURE_CLASS" : "Building",
  "FEATURE_ID" : 2721761,
  "FEATURE_NAME" : "Fairbanks Police Department",
  "MAP_NAME" : "Fairbanks D-2",
  "PRIMARY_LAT_DMS" : "645021N",
  "PRIM_LAT_DEC" : 64.8391607,
  "PRIM_LONG_DEC" : -147.7209857,
  "PRIM_LONG_DMS" : "1474316W",
  "SOURCE_LAT_DEC" : "",
  "SOURCE_LAT_DMS" : "",
  "SOURCE_LONG_DEC" : "",
  "SOURCE_LONG_DMS" : "",
  "STATE_ALPHA" : "AK",
  "STATE_NUMERIC" : 2,
  "_id" : ObjectId("526d0d817c0652b0b3a4c51b"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -147.7209857,
      64.8391607
    ]
  }
}
```

### geoWithin

#### Circle

Three building in circle

```bash
> db.allstates.find({
  loc :
    { $geoWithin :
      { $center :
        [[-147.7209857, 64.8391607], 1]
      }
    },
    'FEATURE_CLASS' : "Building"
  },
  {
    loc: 1,
    FEATURE_NAME:1
  }).limit(3).pretty()
```

```json
{
  "FEATURE_NAME" : "Ester Dome Observatory",
  "_id" : ObjectId("526d0d807c0652b0b3a44c54"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -148.0527778,
      64.8794444
    ]
  }
}
{
  "FEATURE_NAME" : "George C. Thomas Memorial Library",
  "_id" : ObjectId("526d0d807c0652b0b3a4bae0"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -147.7280556,
      64.8447222
    ]
  }
}
{
  "FEATURE_NAME" : "Fairbanks Fire Department Station 1",
  "_id" : ObjectId("526d0d817c0652b0b3a4be80"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -147.717982,
      64.8381587
    ]
  }
}
```

#### Area

Buildings in given area

```bash
 db.allstates.find(
  {loc : 
    { $geoWithin :
      { $geometry :
        {
          type : 'Polygon',
          coordinates : [[
            [-147, 76],
            [-146, 76],
            [-146, 63],
            [-147, 63],
            [-147, 76]]]
        }
      }
    },
    'FEATURE_CLASS' : "Building"
  },
  {
    loc: 1,
    FEATURE_NAME:1
  }).pretty()
```

```json
{
  "FEATURE_NAME" : "Council of Athabascan Tribal Governments Myra Roberts Clinic",
  "_id" : ObjectId("526d0db67c0652b0b3c53365"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -146.4242909,
      67.0173144
    ]
  }
}
{
  "FEATURE_NAME" : "Venetie Volunteer Fire Department",
  "_id" : ObjectId("526d0d817c0652b0b3a4bf71"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -146.4042317,
      67.0150036
    ]
  }
}
{
  "FEATURE_NAME" : "Salcha Fire and Rescue Station 2",
  "_id" : ObjectId("526d0d817c0652b0b3a4bf4f"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -146.9213961,
      64.4606792
    ]
  }
}
```
### Intersects

Buildings in given area (intersects)

```bash
 db.allstates.find(
  {loc : 
    { $geoIntersects :
      { $geometry :
        {
          type : 'Polygon',
          coordinates : [[
            [-147, 76],
            [-146, 76],
            [-146, 63],
            [-147, 63],
            [-147, 76]]]
        }
      }
    },
    'FEATURE_CLASS' : "Building"
  },
  {
    loc: 1,
    FEATURE_NAME:1
  }).pretty()
```

```json
{
  "FEATURE_NAME" : "Salcha Fire and Rescue Station 2",
  "_id" : ObjectId("526d0d817c0652b0b3a4bf4f"),
  "loc" : {
    "type" : "Point",
    "coordinates" : [
      -146.9213961,
      64.4606792
    ]
  }
}
```

### LineString

```bash
> db.allstates.find({
  loc :
    { type :
      "LineString",
      coordinates : 
        [[-146.9213961,64.4606792], [-136.9213961,54.4606792]]
    }
  })
```

```json
# no results !
```

## MMS Monitoring

### Importing

![mms-monitoring-geo-status](../../images/mmalecki/mms-status-geo.png)

### Making points

![mms-monitoring-geo-making-points-status](../../images/mmalecki/mms-status-geo-making-points.png)

# Collections stats..

## Train

```bash
> db.train.stats()
{
  "ns" : "nosql_course.train",
  "count" : 6034195,
  "size" : 9379502152,
  "avgObjSize" : 1554.3916217490485,
  "storageSize" : 10201026544,
  "numExtents" : 24,
  "nindexes" : 1,
  "lastExtentSize" : 2146426864,
  "paddingFactor" : 1.9940000002233105,
  "systemFlags" : 1,
  "userFlags" : 0,
  "totalIndexSize" : 196338464,
  "indexSizes" : {
    "_id_" : 196338464
  },
  "ok" : 1
}
```

## text8

```bash
> db.text8.stats()
{
  "ns" : "nosql_course.text8",
  "count" : 17005207,
  "size" : 667546920,
  "avgObjSize" : 39.25544217133023,
  "storageSize" : 1071038464,
  "numExtents" : 20,
  "nindexes" : 1,
  "lastExtentSize" : 280440832,
  "paddingFactor" : 1,
  "systemFlags" : 1,
  "userFlags" : 0,
  "totalIndexSize" : 552272448,
  "indexSizes" : {
    "_id_" : 552272448
  },
  "ok" : 1
}
```

## Geo

```bash
> db.allstates.stats()
{
  "ns" : "nosql_course.allstates",
  "count" : 6585884,
  "size" : 7605870336,
  "avgObjSize" : 1154.874628219993,
  "storageSize" : 12705017808,
  "numExtents" : 26,
  "nindexes" : 2,
  "lastExtentSize" : 2146426864,
  "paddingFactor" : 1.000000000251506,
  "systemFlags" : 0,
  "userFlags" : 0,
  "totalIndexSize" : 445060560,
  "indexSizes" : {
    "_id_" : 218806112,
    "loc_2dsphere" : 226254448
  },
  "ok" : 1
}
```
