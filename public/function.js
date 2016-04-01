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

function showSearchResult() {
  playVideo.classList.add("hidden");
  trending.classList.add("hidden");
  search.classList.remove('hidden');
  player.setAttribute('src', '');
}

function showPlayVideo() {
  playVideo.classList.remove("hidden");
  trending.classList.add("hidden");
  search.classList.add("hidden");
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
