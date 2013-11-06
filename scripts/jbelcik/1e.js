var conn = new Mongo();
var db = conn.getDB('miasta');
var dataBase = db.miasta.find();
var count = 0;

dataBase.forEach(function (record) {
	if (!record.loc) {
		count += 1;

		var newRecord = {
			"_id": record._id,
			"miasto": record.miasto,
			"loc": {
				"type": "Point",
				"coordinates": [record.szerokosc, record.dlugosc]
			}
		}
		
		db.miasta.remove({"_id": record._id});
		db.miasta.insert(newRecord);
	}
});

print(count + " records changed");