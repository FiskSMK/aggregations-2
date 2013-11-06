# skrypt przerabiający csv (multiline) na jsona
import csv, simplejson, decimal, codecs

data = open("Train.csv")
reader = csv.DictReader(data, delimiter=",", quotechar='"')

i = 0
with codecs.open("Train.json", "w", encoding="utf-8") as out:
   for r in reader:
      i += 1
      if i&65535 == 0: print i # simple 'progress'
      for k, v in r.items():
         # make sure nulls are generated
         if not v:
            r[k] = None
         # parse and generate decimal arrays
         elif k == "loc":
            r[k] = [decimal.Decimal(n) for n in v.strip("[]").split(",")]
         # generate a number
         elif k == "geonameid":
            r[k] = int(v)
      out.write(simplejson.dumps(r, ensure_ascii=False, use_decimal=True)+"\n") 
