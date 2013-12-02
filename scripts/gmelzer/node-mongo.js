var mongo = require('mongodb').MongoClient;

var allTags = 0;
var diffrentTags = 0;
var tags = {};
var counter = 0;
var tmp;

mongo.connect("mongodb://localhost:27017/trains",function(err,db){
	if(err)
		console.log(err);
	else {
		db.collection('trains', function(err, trains){
			if(err)
				console.log(err);
			else {
				var cur = trains.find();
				cur.each(function(err, train){
					if(err)
						console.log(err);
					else if (train === null){
						tmp = [];
						console.log("Ilość dokumentów: " + counter);
						console.log("Ilość różnych tagów: " + diffrentTags);
						console.log("Ilość tagów: " + allTags);
						console.log("Ilość wystąpień danego taga: ");
						for (var tmp in tags){
							console.log(tmp + " " + tags[tmp]);
						}
					}
					else {
						counter++;
						if(train.Tags.constructor !== Array){
							tmp = [];
							if(train.Tags.constructor === String)
								tmp = train.Tags.split(" ");
							else
								tmp.push(train.Tags);
							tmp.forEach(function(x){
								allTags++;
								if(typeof tags[x] !== 'number'){ 
									tags[x] = 1;
									diffrentTags++;
								}
								else
									tags[x]++;
								
							});
							trains.update({_id: train._id},{ $set: {tags: tmp}},function(err){
								if (err) {
									console.log(err);
								}
							});
						}
					}
				});
			}
		});
	}
});