## MongoDB version

```bash
MongoDB version: 2.5.3
```

## Zadanie 1

* a 
  * Przygotowanie danych do importu
  
  ```bash
  $ time bash 2unix.sh Train.csv Train2.csv
  
  real	14m51.329s
  user	0m42.671s
  sys	1m28.238s
  ```

  * Import danych do bazy
  
  ```bash
  $ mongoimport --type csv -c Train --file Train2.csv --headerline
  ```
  
* b
  
  ```bash
  > db.Train.count()
  6034195
  ```
  
* c