var fs = require('fs');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
var request = require('request');
var search = require('youtube-search');
var fetchCommentPage = require('youtube-comment-api')();

var key = 'AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM';

function check(userData, username, password) {
  for (var i = 0; i < userData.length; i++) {
    if (userData[i].username == username && userData[i].password == password) {
      return userData[i];
    }
  }
  return null;
}

app.use(express.static('./public/'));

app.get('/loggedin', cookieParser(), function(req, res) {
  request('https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=5rOiW_xY-kc&type=video&key=AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM', function (error, response, body) {
    if (error) return console.log(err);
    console.log(body);
  });
  if (req.cookies.loggedin == 'true') {
    res.sendStatus(200);
  }
  else {
    res.sendStatus(401);
  }
});

app.post('/login', jsonParser, function(req, res) {
  fs.readFile('fs/data.txt', 'utf8', function(err, data) {
    if(err) return console.log(err);
    parsedData = JSON.parse(data);

    var validate = check(parsedData, req.body.username, req.body.password);
    if (validate != null) {
      res.cookie('loggedin', 'true');
      res.sendStatus(200);
    }
    else {
      res.sendStatus(401);
    }
  });
});

app.get('/logout', function(req, res) {
  res.clearCookie('id');
  res.clearCookie('loggedin');
  res.send();
});

// var myObject =
//  [{id: 4312, username: 'guest', password: '', watchedId: ['DPEJB-FCItk', 'VO-1ePYypdU']},
//   {id: 4564, username: 'j', password: 'p', watchedId: ['DPEJB-FCItk', 'VO-1ePYypdU']},
//   {id: 9187, username: 'justin', password: 'password', watchedId: ['DPEJB-FCItk', 'VO-1ePYypdU']}]
//
// var myData = JSON.stringify(myObject);
//
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
    key: key,
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
    key: key
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
  request('https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&key=AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM&maxResults=8&regionCode=US', function (error, response, body) {
    if (error) return console.log(err);
    res.send(body);
  });
});

app.listen(8080);
