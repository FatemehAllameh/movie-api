// Elements
const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const warningText = document.querySelector(".warning-text");
const paginationBox = document.querySelector(".pagination-box");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const headerTitle = document.querySelector(".header-title");
const nextPageButton = document.querySelector("#next-page-btn");
const prevPageBotton = document.querySelector("#prev-page-btn");
const currentPageText = document.querySelector(".current-page");

let currentPage = 1;
let nextPage = null;
let prevPage = null;
let totalPages = null;
let lastURL = "";

// API DATA
const API_KEY = "6d154eadcf12bb20312a85cea59b903f";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

// Get Movies From API
const getMovies = async (url) => {
  lastURL = url;
  try {
    const response = await fetch(url);
    const data = await response.json();

    loadingBox.style.display = "none";
    errorText.textContent = "";
    paginationBox.style.display = "flex";

    totalPages = data.total_pages;
    currentPageText.innerHTML = currentPage;

    if (totalPages == 1) {
      prevPageBotton.classList.add("disable-btn");
      nextPageButton.classList.add("disable-btn");
    } else if (currentPage >= totalPages) {
      prevPageBotton.classList.remove("disable-btn");
      nextPageButton.classList.add("disable-btn");
    } else if (currentPage <= 1) {
      prevPageBotton.classList.add("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    } else {
      prevPageBotton.classList.remove("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    }

    showMovies(data.results);
  } catch (err) {
    errorText.textContent = err.message;
    loadingBox.style.display = "none";
    paginationBox.style.display = "none";
  }
};

// Show Movies In DOM
const showMovies = (movies) => {
  // Remove Movies With No Poster
  const filteredMovies = movies.filter((movie) => movie.poster_path !== null);
  // Clear The Previous Movie List
  moviesList.innerHTML = "";
  if (filteredMovies.length !== 0) {
    // Clear Warning Text And Show Pagination
    warningText.innerHTML = "";
    paginationBox.style.display = "flex";
    filteredMovies.forEach((movie) => {
      // Destructure Needed Movie Data
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
  } else {
    // Show Warning and Hide Pagination If No Movie Found
    warningText.innerHTML = "NO Result Found!";
    paginationBox.style.display = "none";
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

// Reset Page By Clicking Header Title
headerTitle.addEventListener("click", () => {
  getMovies(API_URL);
  currentPage = 1;
});

// Display Movies Based On Search Input
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  const searchedValue = searchInput.value;
  if (searchedValue) {
    // Active Loading mode
    loadingBox.style.display = "flex";
    moviesList.innerHTML = "";
    getMovies(SEARCH_API + searchedValue);
    searchInput.value = "";
  }
});

// Go To Next Page
nextPageButton.addEventListener("click", () => {
  nextPage = currentPage + 1;
  currentPage++;
  if (nextPage <= totalPages) {
    callPage(nextPage);
  }
});

// Go To Previous Page
prevPageBotton.addEventListener("click", () => {
  if (currentPage > 1) {
    prevPage = currentPage - 1;
    currentPage--;
  }
  if (prevPage >= 1) {
    callPage(prevPage);
  }
});

// UPdate The "page" Param In The API URL And Fetch New Results
const callPage = (page) => {
  const splitedURL = lastURL.split("?");
  const searchParams = new URLSearchParams(splitedURL[1]);
  searchParams.set("page", page);
  const url = splitedURL[0] + "?" + searchParams;
  // Active Loading mode
  loadingBox.style.display = "flex";
  moviesList.innerHTML = "";
  // Scroll To Top
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Fetch Movies For This Page
  getMovies(url);
};

// Initial call
getMovies(API_URL);
