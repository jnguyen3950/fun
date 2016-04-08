function showLoggedIn() {
  loginButton.classList.add("hidden");
  logoutButton.classList.remove("hidden");
  loginError.classList.add("hidden");
  signupButton.classList.add("hidden");
}

function showLoggedOut() {
  loginButton.classList.remove("hidden");
  logoutButton.classList.add("hidden");
  signupButton.classList.remove("hidden");
}

function showHome() {
  playVideo.classList.add("hidden");
  trending.classList.remove("hidden");
  search.classList.add("hidden");
  player.setAttribute('src', '');
}

function showPlaylist() {
  if(!sidebarPlaylist.classList.contains('hidden')) {
    sidebar.classList.toggle('hidden');
    main.classList.toggle('col-md-offset-2');
    main.classList.toggle('col-md-offset-1');
  }
  sidebarPlaylist.classList.remove('hidden');
  sidebarHistory.classList.add('hidden');
}

function showHistory() {
  if(!sidebarHistory.classList.contains('hidden')) {
    sidebar.classList.toggle('hidden');
    main.classList.toggle('col-md-offset-2');
    main.classList.toggle('col-md-offset-1');
  }
  sidebarHistory.classList.remove('hidden');
  sidebarPlaylist.classList.add('hidden');
}

function showTrending() {
  playVideo.classList.add("hidden");
  recommend.classList.add("hidden");
  trending.classList.remove("hidden");
  search.classList.add("hidden");
  player.setAttribute('src', '');
}

function showSearchResult() {
  playVideo.classList.add("hidden");
  recommend.classList.add("hidden");
  trending.classList.add("hidden");
  search.classList.remove('hidden');
  player.setAttribute('src', '');
}

function showRecommendVideo() {
  recommend.classList.remove("hidden");
}

function hideRecommendVideo() {
  recommend.classList.add("hidden");
}

function showPlayVideo() {
  playVideo.classList.remove("hidden");
  recommend.classList.add("hidden");
  trending.classList.add("hidden");
  search.classList.add("hidden");
}

function clearResult(result, num) {
  this.num = num || 0;
  while(result.childNodes.length > this.num) {
    result.removeChild(result.lastChild);
  }
}

function goodTag() {
  document.getElementById('goodTag').classList.remove("hidden");
  document.getElementById('blehTag').classList.add("hidden");
}

function blehTag() {
  document.getElementById('goodTag').classList.add("hidden");
  document.getElementById('blehTag').classList.remove("hidden");
}

function noneTag() {
  document.getElementById('goodTag').classList.add("hidden");
  document.getElementById('blehTag').classList.add("hidden");
}
