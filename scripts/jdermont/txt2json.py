import simplejson

plik = open("text8.txt","r")
out = open("text8.json","w")

i = 0
for line in plik:
  line = line.strip()
  if (len(line) == 0): continue
  i+= 1
  if i&65535 == 0: print i
  d = {"_id":i,"slowo":line}
  out.write(simplejson.dumps(d) + "\n")

plik.close()
out.close()
print i
