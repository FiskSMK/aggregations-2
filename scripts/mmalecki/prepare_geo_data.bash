#!/bin/bash

if [ $# -ne 2 ] ; then
  echo -e "\e[00;31mUsage: $0 path_to_directory output.csv\e[00m"
  exit 1
fi

cd $1

# Translate | to , and save as csv file
for file in `ls *.txt` ; do
  tr --d '\r' < $file | tr '|' ',' > `echo $file | sed 's/txt/csv/g'`
done

# Copy header to output.csv
head -1 `ls *.csv | head -1` > $2.tmp

# Copy content without header to output.csv
for file in `ls *.csv` ; do
  tail -n +2 $file >> $2.tmp
done

# Remove utf chars
iconv -c -f utf-8 -t ascii $2.tmp > $2

rm $2.tmp
