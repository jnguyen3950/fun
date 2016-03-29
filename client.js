var player = document.getElementById('player');
var tag = document.getElementById('tag');
var commentNode = document.getElementById('comment');
var search = document.getElementById('search');
var searchBox = document.getElementById('searchBox');
var searchResult = document.getElementById('searchResult');
var currentDataId;

search.addEventListener('click', function(event) {
  searchData();
})

searchBox.addEventListener('keypress', function(event) {
  if (event.keyCode == 13) {
    searchData();
    event.preventDefault();
  }
})

function searchData() {
  clearResult(searchResult);

  var data = {term: searchBox.value};
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/search');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);
    console.log(response[0]);
    for (var i = 0; i < response.length; i++) {
      addThumbnail(response[i]);
    }
    attachThumbnailListener();
  })
}

function attachThumbnailListener() {
  var nodeList = document.getElementsByClassName('videoImage');
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].addEventListener('click', function(event) {
      var parent = event.target.parentNode;
      currentDataId = parent.getAttribute('data-id');
      var link = parent.getAttribute('data-link');
      link = link.replace("watch?v=", "v/");
      player.setAttribute('src', link);

      clearResult(commentNode);

      var data = {dataId: currentDataId};
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/view');
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));

      xhr.addEventListener('load', function() {
        var response = JSON.parse(xhr.response);
        console.log(response.comments);
        var commentArray = response.comments;
        if(commentArray.length > 0) {
          for (var i = 0; i < commentArray.length; i++) {
            addMedia(commentArray[i], commentNode);
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

function attachPlaylistListener() {
  var nodeList = document.getElementsByClassName('playlistButton');
  for (var i = 0; nodeList.length; i++) {
    nodeList[i].addEventListener('click', function(event) {

    })
  }
}

function addThumbnail(object) {
  var videoBlock = document.createElement('div');
  var videoThumbnail = document.createElement('div');
  var thumbImage = document.createElement('img');
  var caption = document.createElement('div');
  var title = document.createElement('h2');
  var description = document.createElement('p');
  var addPlaylist = document.createElement('a');
  var addPlayListTextNode = document.createTextNode('Add to playlist');

  videoBlock.appendChild(videoThumbnail);
  videoThumbnail.appendChild(thumbImage);
  videoThumbnail.appendChild(caption);
  caption.appendChild(title);
  caption.appendChild(description);
  caption.appendChild(addPlaylist);
  addPlaylist.appendChild(addPlayListTextNode);

  videoBlock.setAttribute('class', 'col-sm-6 col-md-3');
  videoThumbnail.setAttribute('class', 'thumbnail');
  videoThumbnail.setAttribute('data-id', object.id);
  videoThumbnail.setAttribute('data-link', object.link);
  thumbImage.setAttribute('src', object.thumbnails.high.url);
  thumbImage.setAttribute('alt', 'Result video picture.');
  thumbImage.setAttribute('class', 'videoImage');
  caption.setAttribute('class', 'caption');
  addPlaylist.setAttribute('class', 'btn btn-default playlistButton');
  addPlaylist.setAttribute('role', 'button');

  searchResult.appendChild(videoBlock);
}

function addMedia(array, node) {
  var mediaBlock = document.createElement('div');
  var mediaLeft = document.createElement('div');
  var image = document.createElement('img');
  var mediaBody = document.createElement('div');
  var userName = document.createElement('h4');
  var userNameText = document.createTextNode(array.user);
  var commentText = document.createTextNode(array.commentText);

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

  node.appendChild(mediaBlock);

  if(array.hasReplies) {
    for (var i = 0; i < array.replies.length; i++) {
      addMedia(array.replies[i], mediaBody);
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
