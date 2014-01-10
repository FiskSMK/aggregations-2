db = db.getSiblingDB('trainz');
var result = db.train.find();
var dictionary = {};
result.forEach(function(item){
	if(typeof item.tags === "string"){
		var tmp = item.tags.trim().split(/\s+/);
		tmp.forEach(function(x){
			if(typeof dictionary[x] !== 'number') 
				dictionary[x] = 1;
			else
				dictionary[x]++;
			
		});
		db.train.update({_id: item._id},{ $set: {tags: tmp}});
	}
});
var allCount = 0;
for (var el in dictionary) {
	print(el + ", " + dictionary[el]);
	allCount+=dictionary[el];
}
print("Suma tagów: " + allCount);
print("Unikalnych tagów: " + Object.keys(dictionary).length);

