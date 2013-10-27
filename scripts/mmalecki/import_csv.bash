#!/bin/bash

if [ $# -ne 3 ] ; then
  echo -e "\e[00;31mUsage: $0 db collection import.csv\e[00m"
  exit 1
fi

time mongoimport \
  -d $1 \
  -c $2 \
  --type csv \
  --file $3 \
  --headerline \
  --drop \
  --stopOnError
