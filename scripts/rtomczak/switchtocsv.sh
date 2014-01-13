#!/bin/bash

if [ $# -ne 2 ] ; then
  echo -e "Sposób uzycia: $0 sciezka/do/katalogu wynik.csv"
  exit 1
fi

cd $1

# Zmien | to , i zapisz plik jako .csv
for file in `ls *.txt` ; do
  tr --d '\r' < $file | tr '|' ',' > `echo $file | sed 's/txt/csv/g'`
done

# Kopiuj nagowek do pliku csv
head -1 `ls *.csv | head -1` > $2.tmp
# Kopiuj zawartosc bez naglowka do pliku csv

for file in `ls *.csv` ; do
  tail -n +2 $file >> $2.tmp
done

# Usun kodowanie utf
iconv -c -f utf-8 -t ascii $2.tmp > $2

rm $2.tmp
