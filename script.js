// Elements
const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const paginationBox = document.querySelector(".pagination-box");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
// API DATA
const API_KEY = "6d154eadcf12bb20312a85cea59b903f";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Get Movies From API
const getMovies = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    loadingBox.style.display = "none";
    errorText.textContent = "";
    paginationBox.style.display = "flex";
    showMovies(data.results);
  } catch (err) {
    errorText.textContent = err.message;
    loadingBox.style.display = "none";
    paginationBox.style.display = "none";
  }
};

// Show Movies In DOM
const showMovies = (movies) => {
  const filteredMovies = movies.filter((movie) => movie.poster_path !== null);
  moviesList.innerHTML = "";
  if (filteredMovies.length !== 0) {
    filteredMovies.forEach((movie) => {
      console.log(movie);
      const { overview, vote_average, poster_path, title } = movie;
      const movieItem = `
      <div class="movie-item">
            <div class="poster-wrapper">
            <img
              class="movie-poster"
              src="${IMAGE_PATH + poster_path}"
              alt="${title}"
            />

            <div class="movie-overview">
              <h4 class="overview-text">
                ${overview}
              </h4>
            </div>
          </div>
          <div class="info-box">
            <h4 class="movie-name">${title}</h4>
            <span class="movie-vote ${getClassByVote(vote_average)}">
              ${vote_average}
              <i class="fa fa-star"></i>
            </span>
          </div>
            </div>`;
      moviesList.innerHTML += movieItem;
    });
  }
};

// Set BackGround Color According To The Movie Rating
const getClassByVote = (vote) => {
  if (vote >= 8) {
    return "green-vote";
  } else if (vote <= 5) {
    return "red-vote";
  }
};

// Display Movies Based On Search Input
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchedValue = searchInput.value;
  if (searchedValue) {
    getMovies(SEARCH_API + searchedValue);
  }
});

// Initial call
getMovies(API_URL);
