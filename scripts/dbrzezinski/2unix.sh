#! /bin/bash

if [ -z "$1" ] ; then
  echo "First replaces all the \\n with spaces then replaces all the \\r with \\n"
  echo "Replace header line with: _id,title,body,tags (for mongoDB)"
  echo "usage: $0 input.csv output.csv"
  exit 1;
fi

tr '\n' ' ' < "$1" | tr '\r' '\n' > "$2"
sed -i '$ d' "$2"

sed -i '1 c "_id","title","body","tags"' "$2"
