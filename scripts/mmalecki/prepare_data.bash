#!/bin/bash

if [ $# -ne 2 ] ; then
  echo -e "\e[00;31mUsage: $0 input.csv output.csv\e[00m"
  exit 1
fi

tr -d "\n" < "$1" | tr "\r" "\n" > "$2"
