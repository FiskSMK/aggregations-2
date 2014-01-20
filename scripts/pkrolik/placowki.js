db = db.getSiblingDB('geo');
var result = db.placowki.find();
result.forEach(function(item){
	if (item.x)
		db.placowki.insert({PNI: item.PNI, woj: item.województwo, powiat: item.powiat, gmina: item.gmina, nazwa: item["nazwa placówki"], miasto: item.miejscowość, loc:{type:"Point",coordinates:[item.x,item.y]}});
});
result = db.placowki.find();
result.forEach(function(item){
	if (!item.loc)
		db.placowki.remove({_id: item._id});
});
//db.dropDatabase();

