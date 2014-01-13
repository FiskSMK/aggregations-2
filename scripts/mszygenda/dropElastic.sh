#!/bin/bash
curl -XDELETE 'http://localhost:9200/_river/accidents/'
curl -XDELETE 'http://localhost:9200/accidents/'
