import requests

url = 'http://localhost:9200/data/imdb'
f = open("getglue_sample.json","r")
headers = {'Content-type': 'application/json'}
linie = f.readlines()
for i in len(linie):
	linia = f.readline()
	requests.post(url, data = linia, headers = headers)
f.close()