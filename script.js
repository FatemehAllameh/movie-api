// Elements
const loadingBox = document.querySelector(".loading-box");
// API DATA
const API_KEY = "6d154eadcf12bb20312a85cea59b903f";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

// Get Movies From API
const getMovies = async() => {
    const response = await fetch(API_URL);
    const data = await response.json();
    loadingBox.style.display = "none";
}

// Show Movies In DOM
const showMovies = () => {

}

// Initial call
getMovies();