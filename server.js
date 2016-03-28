var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var search = require('youtube-search');

app.post('/search', jsonParser, function(req, res) {
  console.log(req.body.key);

  var opts = {
    maxResults: 12,
    key: 'AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM'
  };

  search(req.body.key, opts, function(err, results) {
    if(err) return console.log(err);
    console.dir(results);
    console.dir(results.id);
    res.send(results);
  });
})

app.use(express.static('./'));

app.listen(8080);
