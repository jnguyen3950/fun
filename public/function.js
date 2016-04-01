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
  trendingResult.classList.remove("hidden");
  searchResult.classList.add("hidden");
}

function showPlayVideo() {
  playVideo.classList.remove("hidden");
  trendingResult.classList.add("hidden");
  searchResult.classList.add("hidden");
}

function showSearchResult() {
  playVideo.classList.add("hidden");
  trendingResult.classList.add("hidden");
  searchResult.classList.remove('hidden');
}

function clearResult(result) {
  while(result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function clearResultExcept(result, num) {
  while(result.childNodes.length > num) {
    result.removeChild(result.lastChild);
  }
}
