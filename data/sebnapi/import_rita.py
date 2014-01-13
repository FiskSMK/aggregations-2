import pickle, csv, pymongo, datetime

connection = pymongo.Connection()
collection = connection.rita.flights
reader_planes = csv.DictReader(open('plane_data/MASTER.txt'))
reader = csv.DictReader(open('RITA/2013/1064976012_T_ONTIME.2.csv'))

planes_dict = {}

try:
   with open('planes_dict.p', 'rb') as f:
       planes_dict = pickle.load(f)
except IOError:
    for line in reader_planes:
        line.pop("")
        for k,v in line.items():
            line[k] = v.strip()             #get rid of whitspaces around fields
        planes_dict[line["N-NUMBER"]] = line
    pickle.dump(planes_dict, open('planes_dict.p', 'wb'))

def make_int(x):
    if(x == ""):
        return 0;
    if("." in x):
        return int(float(x))    

types = {
    'CARRIER_DELAY':    make_int,
    'ORIGIN_CITY_NAME': lambda x : x,
    'FL_NUM':           lambda x : x,
    # 'CRS_ARR_TIME':     lambda x : "%s:%s" % (x[:2], x[2:]),
    # 'CRS_DEP_TIME':     lambda x : "%s:%s" % (x[:2], x[2:]),
    'CANCELLED':        lambda x : bool(x),
    'ARR_DELAY':        make_int,
    #'TAXI_IN':          make_int,
    #'DEP_DEL15':        make_int,
    'CRS_ELAPSED_TIME': make_int,
    'ORIGIN_CITY_MARKET_ID': lambda x : x,
    'WHEELS_ON':        lambda x : "%s:%s" % (x[:2], x[2:]),
    'AIR_TIME':         make_int,
    'WHEELS_OFF':       lambda x : "%s:%s" % (x[:2], x[2:]),
    'ORIGIN_AIRPORT_ID': lambda x : x,
    #'TAXI_OUT':         make_int,
    'DEST_CITY_MARKET_ID': lambda x : x,
    'DEST_CITY_NAME':   lambda x : x,
    'ORIGIN':           lambda x : x,
    'DEP_TIME':         lambda x : "%s:%s" % (x[:2], x[2:]),
    'ACTUAL_ELAPSED_TIME': make_int,
    'ORIGIN_AIRPORT_SEQ_ID': lambda x : x,
    'DEST':             lambda x : x,
    'ARR_DELAY_NEW':    make_int,
    #'DEP_DELAY_GROUP':  make_int,
    'DEST_AIRPORT_SEQ_ID': lambda x : x,
    'NAS_DELAY':        make_int,
    'AIRLINE_ID':       lambda x : x,
    'DEP_DELAY_NEW':    make_int,
    #'FL_DATE':          lambda x : datetime.datetime.strptime(x, "%Y-%m-%d").date(),
    'FL_DATE':          lambda x : x,
    'DISTANCE':         make_int,
    'DEST_AIRPORT_ID':  lambda x : x,
    'DEP_DELAY':        make_int,
    'WEATHER_DELAY':    make_int,
    'ARR_TIME':         lambda x : "%s:%s" % (x[:2], x[2:]),
    'SECURITY_DELAY':   make_int,
    'UNIQUE_CARRIER':   lambda x : x,
    'CARRIER':          lambda x : x,
    #'DEP_TIME_BLK':     lambda x :"%s:%s-%s:%s" % (x.split("-")[0][:2], x.split("-")[0][2:],
    #                                                x.split("-")[1][:2], x.split("-")[1][2:]),
    'LATE_AIRCRAFT_DELAY': make_int,
    'FLIGHTS':          make_int,
    'DIVERTED':         lambda x : bool(x),
    'CANCELLATION_CODE':lambda x : x,
    'TAIL_NUM':         lambda x : x,
    'YEAR':             lambda x : x,
}


for line in reader:
    line.pop("")
    for k,f in types.items():
        line[k] = f(line[k])
    try:
        line["PLANE"] = planes_dict[line['TAIL_NUM'][1:]]
        collection.save(line)
    except KeyError:
        continue
