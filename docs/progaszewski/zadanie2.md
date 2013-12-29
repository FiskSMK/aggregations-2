# Zadanie 2 #

Najpierw z pliku

> getglue_sample.json

wybrałem 2 000 000 pierwszych linii i zapisałem je do pliku 

> getglue_sample_cut.json

użyłem do tego polecania: 

    head -n 2000000 getglue_sample.json > getglue_sample_cut.json

Dane zaimportowałem do bazy MongoDB poleceniem:
    
    time ./bin/mongoimport.exe -d nosql -c bigdata --file ../../getglue_sample_cut.json

Czas trwania importu:

    real 3m53.282s
    user 0m0.015s
    sys  0m0.016s

