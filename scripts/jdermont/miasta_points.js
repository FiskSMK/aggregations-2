var cursor = db.miasta.find()

cursor.forEach(function(input) {
  x = input.szerokosc;
  y = input.dlugosc;
  id = input._id;
  db.miasta.update({"_id":id},{$set:{"loc":{"type":"Point","coordinates":[y,x]}}});
});

