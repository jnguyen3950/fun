var fs = require('fs');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var request = require('request');
var async = require('async');
var search = require('youtube-search');
var fetchCommentPage = require('youtube-comment-api')();

var key = 'AIzaSyDZ9sbX9zra9vN5WUjxMAQCf_5j01pHqVM';

function check(userData, username, password) {
  for (var i = 0; i < userData.length; i++) {
    if (userData[i].username == username && userData[i].password == password) {
      return userData[i].id;
    }
  }
  return null;
}

app.use(express.static('./public/'));

app.get('/loggedin', cookieParser(), function(req, res) {
  if (req.cookies.loggedin == 'true') {
    res.sendStatus(200);
  }
  else {
    res.sendStatus(401);
  }
});

app.post('/login', jsonParser, function(req, res) {
  fs.readFile('fs/data.txt', 'utf8', function(err, data) {
    if(err) res.send(err);
    var parsedData = JSON.parse(data);

    var validateId = check(parsedData, req.body.username, req.body.password);
    if (validateId != null) {
      res.cookie('loggedin', 'true');
      res.cookie('id', validateId);
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
    regionID: 'US',
    type: 'video',
    key: key,
  };

  search(req.body.term, opts, function(err, results) {
    if(err) res.send(err);
    res.send(results);
  });
});

app.post('/searchPlaylist', jsonParser, function(req, res) {
  var opts = {
    key: key
  };

  search(req.body.dataId, opts, function(err, results) {
    if(err) res.send(err);
    res.send(results);
  });
});

app.get('/recommend', cookieParser(), function(req, res) {
  fs.readFile('fs/data.txt', 'utf8', function(err, data) {
    if(err) res.send(err);
    var parsedData = JSON.parse(data);
    for (var i = 0; i < parsedData.length; i++) {
      if (req.cookies.id == parsedData[i].id) {
        var watchedId = parsedData[i].watchedId;
      }
    }
    res.send(watchedId);
  });
});

app.post('/searchRecommend', jsonParser, function(req, res) {
  var queryParam = {
    part: 'snippet',
    maxResults: 1,
    type: 'video',
    relatedToVideoId: req.body.watchedId,
    key: key
  }

  request('https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(queryParam), function (err, response, body) {
    if (err) res.send(err);
    res.send(body);
  });
})

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
  var queryParam = {
    part: 'snippet',
    maxResults: 8,
    chart: 'mostPopular',
    regionID: 'US',
    type: 'video',
    key: key
  }

  request('https://www.googleapis.com/youtube/v3/videos?' + querystring.stringify(queryParam), function (err, response, body) {
    if (err) res.send(err);
    res.send(body);
  });
});

app.listen(8080);
