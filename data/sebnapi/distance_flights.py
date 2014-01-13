from pymongo import MongoClient
from pprint import pprint


client = MongoClient()
db = client.rita
coll = db.flights

# for flight in coll.find():
#     try:
#         flight["PLANE"]["YEAR MFR"] = int(flight["PLANE"]["YEAR MFR"])
#         coll.update({"_id": flight["_id"]}, flight)
#     except:
#         coll.remove({"_id": flight["_id"]})

flights_distance = {}
flights_distance_time = {}
for flight in coll.find({"PLANE.YEAR MFR": {"$gt": 0}, "DISTANCE": {"$gt": 0}}):
    try:
        flights_distance[flight["PLANE"]["YEAR MFR"]] += 1 
        flights_distance_time[flight["PLANE"]["YEAR MFR"]] += flight["DISTANCE"]
    except KeyError:
        flights_distance[flight["PLANE"]["YEAR MFR"]] = 1
        flights_distance_time[flight["PLANE"]["YEAR MFR"]] = flight["DISTANCE"]
    
flights_avg_delay = {}
for k in flights_distance.keys():
    flights_avg_delay[k] = float(flights_distance_time[k])/flights_distance[k]


pprint(flights_avg_delay)


# {1956: 2402.5283018867926,
#  1959: 844.0757142857143,
#  1963: 888.0206896551724,
#  1965: 954.1074380165289,
#  1967: 1232.4591836734694,
#  1968: 800.0619946091645,
#  1971: 364.3741935483871,
#  1972: 2348.6944444444443,
#  1973: 2125.403846153846,
#  1974: 400.1991614255765,
#  1975: 662.624203821656,
#  1976: 487.368004522329,
#  1977: 398.6577916992952,
#  1978: 415.0889212827988,
#  1979: 418.3461240310078,
#  1980: 497.1299081035923,
#  1982: 709.0769230769231,
#  1983: 715.8582089552239,
#  1984: 1629.0546746856205,
#  1985: 930.1767683322518,
#  1986: 1279.0635037843824,
#  1987: 842.3774102523906,
#  1988: 776.2197243515907,
#  1989: 868.6143371267386,
#  1990: 786.8370279883592,
#  1991: 817.6345901997163,
#  1992: 829.8868370807329,
#  1993: 765.7948154207996,
#  1994: 740.3187919463087,
#  1995: 657.8548325318126,
#  1996: 608.5945357752704,
#  1997: 672.0416679032497,
#  1998: 732.0783861931869,
#  1999: 755.9478821223997,
#  2000: 745.7163286973139,
#  2001: 650.1097443902439,
#  2002: 676.4740732501466,
#  2003: 598.1246431867448,
#  2004: 638.8557112641806,
#  2005: 678.5727022096644,
#  2006: 835.7296249915386,
#  2007: 859.0418553802905,
#  2008: 898.5511917161939,
#  2009: 896.4003034517638,
#  2010: 985.0545466338046,
#  2011: 998.8779403748584,
#  2012: 1172.0271445233802,
#  2013: 1138.259426847662}