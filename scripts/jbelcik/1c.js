var conn = new Mongo();
var db = conn.getDB('dataBase');
var dataBase = db.train.find();
var count = 0;

dataBase.forEach(function (record) {
	if (typeof record.tags === 'string') {
		var tableOfTags = record.tags.split(' ');
		count += 1;

		db.train.update(
			{_id: record._id},
			{$set: {tags: tableOfTags}}
		)
	}
});

print(count + " records updated");