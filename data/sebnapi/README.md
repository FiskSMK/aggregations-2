
# Train

## Preparing Raw Data

```
cat Train.csv | tr -d "\n" | tr "\r" "\n" > train_tr.csv
```