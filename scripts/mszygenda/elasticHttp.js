var http = require('http')
var url = require('url')

exports.baseUrl = "http://localhost:9200/"
exports.searchUrl = exports.baseUrl + "accidents/_search"
exports.countUrl = exports.baseUrl + "accidents/_count"

exports.post = function(urlStr, data, callback) {
  var urlObj = url.parse(urlStr)
  var reqOptions = Object.create(urlObj)

  reqOptions.method = 'POST'

  var req = http.request(reqOptions, function (resp) {
    var data = "";
    resp.on('data', function (chunk) {
      data += chunk;
    })

    resp.on('end', function () {
      var dataObj = JSON.parse(data)
      callback(dataObj)
    })
  })

  req.end(JSON.stringify(data))
}


