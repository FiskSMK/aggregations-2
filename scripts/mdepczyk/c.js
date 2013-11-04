var database = db.Train.find();

var tags = {};
var records = [];

var counterTags = 0;
var counterDistinctTags = 0;
var counterRecords = 0;

database.forEach(function(myDoc) {
	counterRecords++;
	var separatedTags = [];
	if(myDoc.tags.constructor === String) {
		separatedTags = myDoc.tags.split(" ");
	} 
	else { 
		separatedTags.push(myDoc.tags);
	}
myDoc.tags = separatedTags;
counterTags = separatedTags.length + counterTags;

for(var i=0; i<separatedTags.length; i++) {
	if(tags[separatedTags[i]] === undefined) {
		counterDistinctTags++;  
		tags[separatedTags[i]] = 1; 
	}
}

records.push(myDoc);
if (counterRecords % 10000 === 0 || counterRecords === 6034195) {
	db.Trainc.insert(records);
	records = [];
	}
});

print("Tags:" + counterTags);
print("Distinct tags:" + counterDistinctTags);
