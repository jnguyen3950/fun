var player = document.getElementById('player');
var tag = document.getElementById('tag');
var playlistButton = document.getElementById('playlistButton');
var historyButton = document.getElementById('historyButton');
var trendingButton = document.getElementById('trendingButton');
var recommendButton = document.getElementById('recommendButton');
var sidebar = document.getElementById('sidebar');
var main = document.getElementById('main');
var commentNode = document.getElementById('comment');
var search = document.getElementById('search');
var searchBox = document.getElementById('searchBox');
var trendingResult = document.getElementById('trendingResult');
var searchResult = document.getElementById('searchResult');

var currentDataId;

var playlistArray = [];
var currentPlaylistIndex = 0;

search.addEventListener('click', function(event) {
  searchData();
})

searchBox.addEventListener('keypress', function(event) {
  if (event.keyCode == 13) {
    searchData();
    event.preventDefault();
  }
})

trendingButton.addEventListener('click', function(event) {
  trendingData();
})

playlistButton.addEventListener('click', function() {
  sidebar.classList.toggle('hidden');
  main.classList.toggle('col-md-offset-2');
  main.classList.toggle('col-md-10');
  main.classList.toggle('col-md-12');
})

function trendingData() {
  clearResult(trendingResult);

  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/trending');
  xhr.send();

  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);
    for (var i = 0; i < response.items.length; i++) {
      var link = "https://www.youtube.com/watch?v=" + response.items[i].id;
      var id = response.items[i].id;
      var img = response.items[i].snippet.thumbnails.high.url;
      var title = response.items[i].snippet.title;
      addThumbnail(trendingResult, link, id, img, title);
    }
    attachThumbnailListener();
    attachPlaylistButtonListener();
  })
}

function searchData() {
  clearResult(searchResult);

  var data = {term: searchBox.value};
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/search');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);
    for (var i = 0; i < response.length; i++) {
      console.log(response[i]);
      link = response[i].link;
      id = response[i].id;
      img = response[i].thumbnails.high.url;
      title = response[i].title;
      addThumbnail(searchResult, link, id, img, title);
    }
    attachThumbnailListener();
    attachPlaylistButtonListener();
  })
}

function attachThumbnailListener() {
  var nodeList = document.getElementsByClassName('videoImage');
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].addEventListener('click', function(event) {
      currentDataId = event.target.getAttribute('data-id');
      var link = event.target.getAttribute('data-link');
      link = link.replace("watch?v=", "v/");
      player.setAttribute('src', link);

      clearResult(commentNode);

      var data = {dataId: currentDataId};
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/comments');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));

      xhr.addEventListener('load', function() {
        var response = JSON.parse(xhr.response);
        var commentArray = response.comments;
        if(commentArray.length > 0) {
          for (var i = 0; i < commentArray.length; i++) {
            addCommentMedia(commentArray[i], commentNode);
          }
        }
        else {
          var noComment = document.createElement('h1');
          var noCommentText = document.createTextNode('No comment.');
          noComment.appendChild(noCommentText);
          commentNode.appendChild(noComment);
        }
      })
    })
  }
}

function attachPlaylistButtonListener() {
  var nodeList = document.getElementsByClassName('playlistButton');
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].addEventListener('click', function(event) {
      var playlistId = event.target.getAttribute('data-id');
      playlistArray.push(playlistId);
      playlistArray = _.uniq(playlistArray);
      showPlaylist(playlistArray);
    })
  }
}

function addThumbnail(node, link, id, img, titleText) {
  var videoBlock = document.createElement('div');
  var videoThumbnail = document.createElement('div');
  var thumbImage = document.createElement('img');
  var caption = document.createElement('div');
  var title = document.createElement('h4');
  var titleTextNode = document.createTextNode(titleText);
  var description = document.createElement('p');
  var addPlaylist = document.createElement('a');
  var addPlayListTextNode = document.createTextNode('Add to playlist');

  node.appendChild(videoBlock);
  videoBlock.appendChild(videoThumbnail);
  videoThumbnail.appendChild(thumbImage);
  videoThumbnail.appendChild(caption);
  caption.appendChild(title);
  caption.appendChild(description);
  caption.appendChild(addPlaylist);
  title.appendChild(titleTextNode);
  addPlaylist.appendChild(addPlayListTextNode);

  videoBlock.setAttribute('class', 'col-sm-6 col-md-3');
  videoThumbnail.setAttribute('class', 'thumbnail');
  thumbImage.setAttribute('data-link', link);
  thumbImage.setAttribute('data-id', id);
  thumbImage.setAttribute('src', img);
  thumbImage.setAttribute('alt', 'Result video picture.');
  thumbImage.setAttribute('class', 'videoImage');
  caption.setAttribute('class', 'caption');
  addPlaylist.setAttribute('class', 'btn btn-default playlistButton');
  addPlaylist.setAttribute('role', 'button');
  addPlaylist.setAttribute('data-link', link);
  addPlaylist.setAttribute('data-id', id);
  addPlaylist.setAttribute('data-img', img);
}

function showPlaylist(playlistArray) {
  while (currentPlaylistIndex < playlistArray.length) {
    var data = {dataId: playlistArray[currentPlaylistIndex]};

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'searchPlaylist');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.addEventListener('load', function() {
      var response = JSON.parse(xhr.response);

      var sidebarList = document.getElementById('sidebarList');
      var videoBlock = document.createElement('div');
      var videoThumbnail = document.createElement('div');
      var thumbImage = document.createElement('img');
      var caption = document.createElement('div');
      var title = document.createElement('h2');

      sidebarList.appendChild(videoBlock);
      videoBlock.appendChild(videoThumbnail);
      videoThumbnail.appendChild(thumbImage);
      videoThumbnail.appendChild(caption);
      caption.appendChild(title);

      videoThumbnail.setAttribute('class', 'thumbnail');
      thumbImage.setAttribute('data-link', response[0].link);
      thumbImage.setAttribute('data-id', response[0].id);
      thumbImage.setAttribute('src', response[0].thumbnails.high.url);
      thumbImage.setAttribute('alt', 'Result video picture.');
      thumbImage.setAttribute('class', 'videoImage');
      caption.setAttribute('class', 'caption');

      attachThumbnailListener();

      videoBlock.addEventListener('click', function() {
        videoBlock.removeChild(videoBlock.firstChild);
      })
    })
    currentPlaylistIndex++;
  }
}

function addCommentMedia(array, node) {
  var mediaBlock = document.createElement('div');
  var mediaLeft = document.createElement('div');
  var image = document.createElement('img');
  var mediaBody = document.createElement('div');
  var userName = document.createElement('h4');
  var userNameText = document.createTextNode(array.user);
  var commentText = document.createTextNode(array.commentText);

  node.appendChild(mediaBlock);
  mediaBlock.appendChild(mediaLeft);
  mediaLeft.appendChild(image);
  mediaBlock.appendChild(mediaBody);
  mediaBody.appendChild(userName);
  userName.appendChild(userNameText);
  mediaBody.appendChild(commentText);

  mediaBlock.setAttribute('class', 'media');
  mediaLeft.setAttribute('class', 'media-left');
  image.setAttribute('class', 'media-object');
  image.setAttribute('src', '');
  image.setAttribute('style', 'width: 64px; height: 64px;');
  mediaBody.setAttribute('class', 'media-body');
  userName.setAttribute('class', 'media-heading');

  if(array.hasReplies) {
    for (var i = 0; i < array.replies.length; i++) {
      addCommentMedia(array.replies[i], mediaBody);
    }
  }
}

function clearResult(result) {
  while(result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

(function addTag() {
  var tagSet = document.createElement('div');
  var tagLabelThumbup = document.createElement('label');
  var tagThumbup = document.createElement('input');
  var thumbup = document.createElement('span');
  var thumbupText = document.createTextNode(' Good');
  var tagLabelThumbdown = document.createElement('label');
  var tagThumbdown = document.createElement('input');
  var thumbdown = document.createElement('span');
  var thumbdownText = document.createTextNode(' Bleh');

  tagSet.setAttribute('class', 'btn-group pull-right');
  tagSet.setAttribute('data-toggle', 'buttons');
  tagLabelThumbup.setAttribute('class', 'btn btn-default');
  tagThumbup.setAttribute('type', 'radio');
  thumbup.setAttribute('class', 'fa fa-thumbs-o-up');
  tagLabelThumbdown.setAttribute('class', 'btn btn-default');
  tagThumbdown.setAttribute('type', 'radio');
  thumbdown.setAttribute('class', 'fa fa-thumbs-o-down');

  tag.appendChild(tagSet);
  tagSet.appendChild(tagLabelThumbup);
  tagSet.appendChild(tagLabelThumbdown);
  tagLabelThumbup.appendChild(thumbup);
  tagLabelThumbup.appendChild(tagThumbup);
  thumbup.appendChild(thumbupText);
  tagLabelThumbdown.appendChild(thumbdown);
  tagLabelThumbdown.appendChild(tagThumbdown);
  thumbdown.appendChild(thumbdownText);
}());
