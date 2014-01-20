#! /bin/bash

iconv -f Windows-1250 -t UTF-8 E-Przesylka-PlacowkiPP-csv.csv | tr ';' ',' | sed 's/#,,/,/g' > lp.csv
mongoimport -d geo -c placowki --type csv --file lp.csv --headerline