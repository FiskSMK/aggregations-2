#/bin/env python2
import sys,os,simplejson
import Przerabiacz

if len(sys.argv) < 2:
  print "Nie podano plikow"
  exit()

katalog = sys.argv[1]
if os.path.isfile(katalog):
  print "To nie katalog"
  exit()

licznik = 0
odrzucone = 1
dirList = os.listdir(katalog)
jason = open(katalog.strip("/")+".json","w")

p = Przerabiacz.Przerabiacz()
for dirOne in dirList:
  if os.path.isfile(katalog+"/"+dirOne):
    licznik += 1
    plik_name = katalog+"/"+dirOne
    
    p.setName(plik_name)
    p.parse()
    d = p.getDict()
    
    if d == None:
      odrzucone += 1
      continue
    jason.write(simplejson.dumps(d,ensure_ascii=False).encode("utf-8") + "\n")
    if licznik%100 == 0: print "Przerobiono %i..." % licznik

jason.close()
print "Przerobiono %i" % licznik
print "Odrzucono %i" % odrzucone
