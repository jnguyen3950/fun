var player = document.getElementById('player');
var commentNode = document.getElementById('comment');
var search = document.getElementById('search');
var searchBox = document.getElementById('searchBox');
var searchResult = document.getElementById('searchResult');
var current-data-id;

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

  videoBlock.setAttribute('class', 'col-sm-6 col-md-3 videoBlock');
  videoThumbnail.setAttribute('class', 'thumbnail');
  thumbImage.setAttribute('data-link', object.link);
  thumbImage.setAttribute('data-id', object.id);
  thumbImage.setAttribute('src', object.thumbnails.high.url);
  thumbImage.setAttribute('alt', 'Result video picture.');
  caption.setAttribute('class', 'caption');
  addPlaylist.setAttribute('class', 'btn btn-default');
  addPlaylist.setAttribute('role', 'button');

  searchResult.appendChild(videoBlock);
}

function attachThumbnailListener() {
  var nodeList = document.getElementsByClassName('videoBlock');
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].addEventListener('click', function(event) {
      var link = event.target.getAttribute('data-link');
      link = link.replace("watch?v=", "v/");
      player.setAttribute('src', link);
    })
  }
}

var commentButton = document.getElementById('commentButton');
commentButton.addEventListener('click', function() {
  clearResult(commentNode);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/view');
  xhr.send();

  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.response);
    console.log(response.comments);
    var commentArray = response.comments;
    for (var i = 0; i < commentArray.length; i++) {
      addMedia(commentArray[i], commentNode);
    }

  })
})

// <div class="media">
//   <div class="media-left">
//     <a href="#"><img class="media-object" style="width: 64px; height: 64px;"></a>
//   </div>
//   <div class="media-body">
//     <h4 class="media-heading">Another media heading</h4>
//     Say more things.
//   </div>
// </div>

function addMedia(array, node) {
  var mediaBlock = document.createElement('div');
  var mediaLeft = document.createElement('div');
  var image = document.createElement('img');
  var mediaBody = document.createElement('div');
  var userName = document.createElement('h3');
  var userNameText = document.createTextNode(array.user);
  var commentText = document.createTextNode(array.commentText);

  mediaBlock.appendChild(mediaLeft);
  mediaLeft.appendChild(image);
  mediaBlock.appendChild(mediaBody);
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
    // addMedia()
  }
}

function clearResult(result) {
  while(result.firstChild) {
    result.removeChild(result.firstChild);
  }
}
