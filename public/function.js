function showLoggedIn() {
  loginButton.classList.add("hidden");
  logoutButton.classList.remove("hidden");
  loginError.classList.add("hidden");
}

function showLoggedOut() {
  loginButton.classList.remove("hidden");
  logoutButton.classList.add("hidden");
}

function showHome() {
  playVideo.classList.add("hidden");
  trending.classList.remove("hidden");
  search.classList.add("hidden");
  player.setAttribute('src', '');
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
