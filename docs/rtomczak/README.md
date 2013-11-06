## MongoDB version

```bash
MongoDB version: 2.5.3
```

## Zadanie 1

* a 
  * ####Przygotowanie danych do importu
  
    ```bash
        $ time bash 2unix.sh Train.csv Train2.csv
  
        real    14m51.329s
        user    0m42.671s
        sys     1m28.238s
    ```

  * ####Import danych do bazy
  
    ```bash
    $ mongoimport --type csv -c Train --file Train2.csv --headerline
    ```
    ![Zdjecie_z_importu_danych](../../images/rtomczak/Czas_zaimportowania.png "Zaimportowanie  Train'a")
  
* b 
    #### Obliczanie ilosci rekordow
    
    ```bash
        > db.Train.count()
        6034195
    ```
  
* c
    #### Zmiana ciagu tagow w tablice tagow za pomocą [tego](https://github.com/roberttomczak/aggregations-2/blob/master/scripts/rtomczak/tagi.py "Program") skryptu

* d
    * #### Przygotowanie danych do importu za pomoca [tego](https://github.com/roberttomczak/aggregations-2/blob/master/scripts/rtomczak/StringToJSON.sh "Program") skryptu

    ```bash
        $ time bash StringToJSON.sh text8 text8.json

        real    1m34.271s
        user    0m20.201s
        sys     0m58.584s
    ```
    
    * #### Import danych do bazy
    
        ![Zdjecie_import_danych](../../images/rtomczak/zaimportowanie_text.png "Zaimportowanie text8.json")
        
    * #### Zliczanie slow
    ```bash
        >db.text8.count()
        17005207
    ```
    
    * #### Zliczanie roznych slow
    ```bash
        >db.text8.distinct("word").length
        253854
    ```
    
    * #### Udział procentowy (kod)
    
    ```javascript
        var totalWordCount = db.words.count()

        function sumWordCount(acc, wordGroup) {
          return acc + wordGroup.count
        }
        
        function percent(wordCount) {
          return (wordCount / totalWordCount) * 100
        }
        
        var top1000 = db.words.aggregate({ $group: { _id: "$word", count: { $sum: 1 } } } , { $sort: { count: -1 } }, { $limit: 1000 }).result
        var top100 = top1000.slice(0, 100)
        var top10 = top100.slice(0, 10)
        var top1 = top10.slice(0, 1)
        
        var top1Percent = percent(top1.reduce(sumWordCount, 0)) 
        var top10Percent = percent(top10.reduce(sumWordCount, 0))
        var top100Percent = percent(top100.reduce(sumWordCount, 0))
        var top1000Percent = percent(top1000.reduce(sumWordCount, 0))
    ```
    #### Wyniki
    ```
    > top1Percent
    6.241594118789616
    
    > top10Percent
    24.733394894869555
    
    > top100Percent
    47.03840417820259
    
    > top1000Percent
    67.23443001899359 
    ```