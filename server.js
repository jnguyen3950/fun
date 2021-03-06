var fs = require('fs');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json();
var cookieParser = require('cookie-parser');
var querystring = require('querystring');
var request = require('request');
var search = require('youtube-search');
var _ = require('underscore');

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

app.post('/signup', jsonParser, function(req, res) {
  var taken = false;
  fs.readFile('fs/data.txt', 'utf8', function(err, data) {
    if(err) res.send(err);
    var parsedData = JSON.parse(data);

    for (var i = 0; i < parsedData.length; i++) {
      if (parsedData[i].username == req.body.username) {
        taken = true;
      }
    }
    if (taken) res.sendStatus(400);
    else {
      var newUser = {
        id: parsedData.length,
        username: req.body.username,
        password: req.body.password,
        playlist: [],
        watchedId: [],
        thumb: []
      }
      parsedData.push(newUser);

      var myData = JSON.stringify(parsedData);
      fs.writeFile('fs/data.txt', myData, function(err) {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
      res.sendStatus(200);
    }
  });
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

app.post('/search', jsonParser, function(req, res) {
  var opts = {
    maxResults: 12,
    regionID: 'US',
    type: 'video',
    textFormat: 'plainText',
    key: key,
  };

  search(req.body.term, opts, function(err, results) {
    if(err) res.send(err);
    res.send(results);
  });
});

app.get('/getPlaylist', cookieParser(), function(req, res) {
  var promise = new Promise(function(resolve, reject) {
    fs.readFile('fs/data.txt', 'utf8', function(err, data) {
      if(err) res.send(err);
      var parsedData = JSON.parse(data);
      for (var i = 0; i < parsedData.length; i++) {
        if (req.cookies.id == parsedData[i].id) {
          var playlist = parsedData[i].playlist;
        }
      }
      resolve(playlist);
    });
  });
  promise.then(function(value) {
    res.send(value);
  });
})

app.post('/searchVideoId', jsonParser, function(req, res) {
  var opts = {
    maxResults: 1,
    textFormat: 'plainText',
    key: key
  };

  search(req.body.dataId, opts, function(err, results) {
    if(err) res.send(err);
    res.send(results);
  });
});

app.post('/writePlaylist', jsonParser, cookieParser(), function(req, res) {
  var promise = new Promise(function(resolve, reject) {
    fs.readFile('fs/data.txt', 'utf8', function(err, data) {
      if(err) res.send(err);
      var parsedData = JSON.parse(data);
      resolve(parsedData);
    });
  });

  promise.then(function(value) {
    for (var i = 0; i < value.length; i++) {
      if (value[i].id == req.cookies.id) {
        if(req.body.videoId.length == 1) {
          value[i].playlist = value[i].playlist.concat(req.body.videoId);
          value[i].playlist = _.uniq(value[i].playlist);
        }
        else {
          value[i].playlist = req.body.videoId;
        }
      }
    }
    var myData = JSON.stringify(value);
    fs.writeFile('fs/data.txt', myData, function(err) {
      if (err) {
        res.sendStatus(500);
      }
    });
  });
});

app.get('/history', cookieParser(), function(req, res) {
  var promise = new Promise(function(resolve, reject) {
    fs.readFile('fs/data.txt', 'utf8', function(err, data) {
      if(err) res.send(err);
      var parsedData = JSON.parse(data);
      for (var i = 0; i < parsedData.length; i++) {
        if (req.cookies.id == parsedData[i].id) {
          var watchedId = parsedData[i].watchedId;
        }
      }
      resolve(watchedId);
    });
  });
  promise.then(function(value) {
    res.send(value);
  });
});

app.post('/writeHistory', jsonParser, cookieParser(), function(req, res) {
  var thumb;

  var promise = new Promise(function(resolve, reject) {
    fs.readFile('fs/data.txt', 'utf8', function(err, data) {
      if(err) res.send(err);
      var parsedData = JSON.parse(data);
      resolve(parsedData);
    });
  })

  promise.then(function(value) {
    for (var i = 0; i < value.length; i++) {
      if (value[i].id == req.cookies.id) {
        var watchedBefore = false;
        for (var j = 0; j < value[i].watchedId.length; j++) {
          if(value[i].watchedId[j] == req.body.videoId) {
            watchedBefore = true;
            if(req.body.thumb != 0) {
              value[i].thumb[j] = req.body.thumb;
              thumb = req.body.thumb;
            }
            else thumb = value[i].thumb[j];
          }
        }
        if(!watchedBefore) {
          value[i].watchedId.push(req.body.videoId);
          value[i].thumb.push(req.body.thumb);
        }
      }
    }

    var myData = JSON.stringify(value);
    fs.writeFile('fs/data.txt', myData, function(err) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.send(JSON.stringify(thumb));
    });
  });
});

app.post('/searchRecommend', jsonParser, function(req, res) {
  var queryParam = {
    part: 'snippet',
    maxResults: 1,
    type: 'video',
    relatedToVideoId: req.body.watchedId,
    textFormat: 'plainText',
    key: key
  }

  request('https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(queryParam), function (err, response, body) {
    if (err) res.send(err);
    res.send(body);
  });
})

app.post('/comments', jsonParser, function(req, res) {
  var queryParam = {
    part: 'snippet',
    videoId: req.body.dataId,
    maxResult: 20,
    moderationStatus: 'published',
    order: 'relevance',
    textFormat: 'plainText',
    key: key
  }

  request.get('https://www.googleapis.com/youtube/v3/commentThreads?' + querystring.stringify(queryParam), function(err, response, body) {
    if (err) res.send(err);
    res.send(body);
  })
});

app.get('/trending', function(req, res) {
  var queryParam = {
    part: 'snippet',
    maxResults: 8,
    chart: 'mostPopular',
    regionID: 'US',
    type: 'video',
    textFormat: 'plainText',
    key: key
  }

  request('https://www.googleapis.com/youtube/v3/videos?' + querystring.stringify(queryParam), function (err, response, body) {
    if (err) res.send(err);
    res.send(body);
  });
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
 console.log("listening on port " + port);
});
