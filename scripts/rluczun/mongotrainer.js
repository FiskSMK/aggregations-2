//Rafał Łuczun

var MongoClient = require('mongodb').MongoClient;
var COUNT = 6034195;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    db.collection('train', function(err, col) {
      if (err) {
        throw err;
      } else {
        var cursor = col.find({}, {tags: 1, _id : 1});
        var status = 0,
            repaired = 0,
            tagsCount = 0,
            diffTags = 0,
            numberOfTags = {};
        cursor.each(function(err, res) {
          if (err) {
            throw err;
          } else if(res !== null) {
            status++;
            if (status % 100000 == 0) {
              console.log('Progress: ' + ((status / COUNT)*100).toFixed(2) + '%');
            }
            if(Object.prototype.toString.call(res.tags) !== '[object Array]' ) {
              var tagsArray = [];
              if (res.tags) {
                // Tag is number, only if exist one number tag, else is String
                if (typeof res.tags === 'number') {
                  tagsArray.push(res.tags);
                // Looking for separator, some tags are differently separated
                } else if (res.tags.indexOf(',') !== -1) {
                  tagsArray = res.tags.split(',');
                } else if (res.tags.indexOf('-') !== -1) {
                  tagsArray = res.tags.split('-');
                } else if (res.tags.indexOf(' ') !== -1) {
                  tagsArray = res.tags.split(' ');
                } else {
                  tagsArray = res.tags;
                }
                // After repair, counting
                for (var i = 0; i < tagsArray.length; i++ ) {
                  if (!numberOfTags[tagsArray[i]]) {
                    numberOfTags[tagsArray[i]] = 1;
                  } else {
                    numberOfTags[tagsArray[i]] += 1;
                  }
                  tagsCount++;
                }
                col.update({_id: res._id}, {$set : {tags : tagsArray}}, function(err, upd){});
                repaired++;
              }
            } else {
              // Loop for save tags occurency(need a lot of RAM memory)
              for (var i = 0; i < res.tags.length; i++ ) {
                if (!numberOfTags[res.tags[i]]) {
                  numberOfTags[res.tags[i]] = 1;
                } else {
                  numberOfTags[res.tags[i]] += 1;
                }
                tagsCount++;
              }
            }
          } else {
            console.log('Results of program');
            // Looking for unique tags
            for (key in numberOfTags) {
              if (numberOfTags[key] === 1) {
                diffTags++;
              }
            }
            console.log('All tags count: ' + tagsCount + '\Unique tags count : ' + diffTags + '\Unique tags as all part : ' +
              (diffTags / tagsCount).toFixed(10)*100 + '%');
            db.close();
          }
        }); 
      }
    });  
  };
});