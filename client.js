var player = document.getElementById('player');
var search = document.getElementById('search');
var searchBox = document.getElementById('searchBox');
var searchResult = document.getElementById('searchResult');

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
  var data = {key: searchBox.value};

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/search');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.addEventListener('load', function() {
    var response = JSON.parse(xhr.responseText);
    for (var i = 0; i < 12; i++) {
      addThumbnail(response[i]);
      console.log(response[i]);
      console.log(response[i].thumbnails.high.url);
      // thumbImage.setAttribute('src', response[i].thumbnails.high.url);
      // searchResult.appendChild(videoBlock);


      // console.log(response[0].link);
      // var url = _.propertyOf(response[0])('link');
      // url = url.replace("watch?v=", "v/");
      // player.setAttribute('src', url);


    }
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

  videoBlock.setAttribute('class', 'col-sm-6 col-md-3');
  videoThumbnail.setAttribute('class', 'thumbnail');
  thumbImage.setAttribute('alt', 'Result video picture.');
  caption.setAttribute('class', 'caption');
  addPlaylist.setAttribute('class', 'btn btn-default');
  addPlaylist.setAttribute('role', 'button');

  thumbImage.setAttribute('src', object.thumbnails.high.url);
  searchResult.appendChild(videoBlock);
}
