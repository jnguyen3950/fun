var player = document.getElementById('player');
var search = document.getElementById('search');
var searchBox = document.getElementById('searchBox');

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
    // console.log(response[0]);
    // console.log(response[0].link);
    var url = _.propertyOf(response[0])('link');
    url = url.replace("watch?v=", "v/");
    player.setAttribute('src', url);
  })
}
