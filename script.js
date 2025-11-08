// Elements
const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const paginationBox = document.querySelector(".pagination-box");
// API DATA
const API_KEY = "6d154eadcf12bb20312a85cea59b903f";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

// Get Movies From API
const getMovies = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
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
  moviesList.innerHTML = "";
  if (movies.length !== 0) {
    movies.forEach((movie) => {
      const { overview, popularity, poster_path, title } = movie;
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
            <span class="movie-vote">
              ${popularity}
              <i class="fa fa-star"></i>
            </span>
          </div>
            </div>`;
      console.log(movieItem);
      moviesList.innerHTML += movieItem;
    });
  }
};

// Initial call
getMovies();
