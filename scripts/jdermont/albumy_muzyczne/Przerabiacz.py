#!/usr/env python2
import chardet,re

class Przerabiacz:
  def __init__(self):
    self.d = None
  
  def setName(self,name):
    self.name = name
    self.d = None
    
  def parse(self):
    plik = open(self.name,"r")
    tresc = plik.read()
    plik.close()
    code = chardet.detect(tresc)['encoding']
    dlugosc = re.findall("# Disc length: (\d+)",tresc)
    if len(dlugosc) > 0: dlugosc = int(dlugosc[0])
    else: dlugosc = 0
    #disc_id = re.findall("DISCID=([0-9a-z]+)",tresc)[0]
    title = re.findall("DTITLE=(.*)",tresc)[0]
    if " / " in title:
      autor = title.split(" / ")[0]
      tytul = title.split(" / ")[1]
    else:
      autor = "unspecified"
      tytul = title
    year = re.findall("DYEAR=(\d+)",tresc)
    if len(year) == 0: rok = 0
    else: rok = int(year[0])
    gatunek = re.findall("DGENRE=(.*)",tresc)[0]
    if len(gatunek) < 1: gatunek = "unspecified"
    utwory = re.findall("TITLE\d+=(.*)",tresc)
    for i in range(len(utwory)):
      try:
	utwory[i] = utwory[i].decode(code)
      except:
	self.d = None
	return
    
    try:
      self.d = {"artist":autor.decode(code),"length":dlugosc,"year":rok,"genre":gatunek.decode(code),"title":tytul.decode(code),"tracks":utwory}   
    except UnicodeDecodeError:
      self.d = None
    
  def getDict(self):
    return self.d
