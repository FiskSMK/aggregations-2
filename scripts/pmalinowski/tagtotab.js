var mongo = require('mongodb').MongoClient;
var tagcount = 0;
var diffcount = 0;
var tmp,a=0;
var alltags = new Array();
mongo.connect("mongodb://localhost:27017/test",function(err,db){
	if(!err){
		db.collection('Train', function(err, coll){
			coll.find().count(function(err, siz) {
				console.log('number of items:' + siz);
			});

			coll.find().each(function(err, item) {
				if(item === null){
					console.log('wszystkich tagow: ' + tagcount );
					console.log('roznych tagow: ' + diffcount );
				}
				else{
					if(item.tags.constructor === String){	
						var tmp = item.tags.split(' ');
						for(a=tmp.length-1; a>=0; a-=1){
							if(alltags.indexOf(tmp[a]) === -1){
								alltags.push(tmp[a]);
								diffcount+=1;
							}
							tagcount+=1;
						}
					}
					coll.update({_id: item._id},{ $set: {tags: tmp}},function(err){
								if (err) console.log(err);
								
					});
				}
			});
			
		});
		
	}
});