var fs = require('fs');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var request = require('request');
var search = require('youtube-search');
var fetchCommentPage = require('youtube-comment-api')();

var myObject =
 [{id: 4312, username: 'guest', password: ''},
  {id: 4564, username: 'j', password: 'p'},
  {id: 9187, username: 'justin', password: 'password'}]

var myData = JSON.stringify(myObject);

// app.get('/check', function(req, res) {
//
// })

app.post('/login', jsonParser, function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);

  fs.readFile('fs/data.txt', 'utf8', function(err, data) {
    if(err) return console.log(err);
    parsedData = JSON.parse(data);
    for (var i = 1; i < parsedData.length; i++) {
      console.log(parsedData[i].id);
      console.log(parsedData[i].password);
    }
  });
})

// fs.writeFile('fs/data.txt', myData, function(err) {
//   if (err) {
//     console.log('There has been an error saving your configuration data.');
//     console.log(err.message);
//     return;
//   }
//   console.log('Configuration saved successfully.')
// });

app.post('/search', jsonParser, function(req, res) {
  var opts = {
    maxResults: 12,
    key: 'AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM',
    type: 'video',
    regionID: 'US'
  };

  search(req.body.term, opts, function(err, results) {
    if(err) return console.log(err);
    res.send(results);
  });
});

app.post('/searchPlaylist', jsonParser, function(req, res) {
  var opts = {
    key: 'AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM'
  };

  search(req.body.dataId, opts, function(err, results) {
    if(err) return console.log(err);
    res.send(results);
  });
});

app.post('/comments', jsonParser, function(req, res) {
  fetchCommentPage(req.body.dataId).then(function (commentPage) {
    res.send(commentPage);
    // return commentPage.nextPageToken;
  // }).then(function (pageToken) {
  //   // request next page
  //   return fetchCommentPage('KuvWdZ3SJuQ', pageToken)
  // }).then(function (commentPage) {
  //   console.log(commentPage);
  });
});

app.get('/trending', function(req, res) {
  //Return most popular
  request('https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&key=AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM&maxResults=12&regionCode=US', function (error, response, body) {
    if (error) return console.log(err);
    res.send(body);
  })
})



app.use(express.static('./'));

app.listen(8080);
