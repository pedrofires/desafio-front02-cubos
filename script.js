const movies = document.querySelector(".movies");

const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");

const input = document.querySelector(".input");

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");

let page = 0;
let moviesFromFetch = [];
let catalog = [];

searchMovies();
todaysMovie();

function changePage(numberOfPages) {
   page += numberOfPages;

   if (page > 3) {
      page = 0;
   } else if (page < 0) {
      page = 3;
   }

   showFilms(page);
}

function allocateFilms(arrOfMovies) {
   let index = 0;
   let quantityDisplayed = 5;

   for (let i = index; i < 4; i++) {
      const moviePage = arrOfMovies.slice(index, quantityDisplayed);
      index += 5;
      quantityDisplayed += 5;
      catalog.push(moviePage);
   }
}

function showFilms(page) {
   moviesFromFetch.forEach((movie) => {
      movie.classList.add("hidden");
   });

   const currentPage = catalog[page];
   for (let i = 0; i < currentPage.length; i++) {
      const element = currentPage[i];
      element.classList.remove("hidden");
   }
}

btnNext.addEventListener("click", (increment) => {
   increment = 1;
   resetGenres();
   changePage(increment);
});
btnPrev.addEventListener("click", (increment) => {
   increment = -1;
   resetGenres();
   changePage(increment);
});
modalClose.addEventListener("click", closeModal);

function searchMovies(query) {
   let linkFetch = `https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false`;

   if (query) {
      linkFetch = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${query}`;
   }

   fetch(linkFetch).then((responseFetch) => {
      const promiseBody = responseFetch.json();

      moviesFromFetch = [];
      catalog = [];
      promiseBody.then((content) => {
         data = content.results;
         data.forEach((element) => {
            const movie = document.createElement("div");
            movie.classList.add("movie");
            movie.style.backgroundImage = `url('${element.poster_path}')`;
            movie.id = element.id;

            const movieInfo = document.createElement("div");
            movieInfo.classList.add("movie__info");

            const movieTitle = document.createElement("span");
            movieTitle.classList.add("movie__title");
            movieTitle.textContent = element.title;

            const movieRating = document.createElement("span");
            movieRating.classList.add("movie__rating");
            movieRating.textContent = element.vote_average;

            const stars = document.createElement("img");
            stars.src = "./assets/estrela.svg";
            stars.alt = "Estrela";

            movieRating.append(stars);
            movieInfo.append(movieTitle, movieRating);
            movie.append(movieInfo);
            movies.append(movie);

            movie.addEventListener("click", (event) => {
               openImage(event.target.id);
            });

            moviesFromFetch.push(movie);
         });
         allocateFilms(moviesFromFetch);
         showFilms(0);
      });
   });
}
function todaysMovie() {
   fetch(
      `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`
   ).then((responseFetch) => {
      const promiseBody = responseFetch.json();

      promiseBody.then((content) => {
         const highlightVideo = document.querySelector(".highlight__video");
         const highlightTitle = document.querySelector(".highlight__title");
         const highlightRating = document.querySelector(".highlight__rating");
         const highlightGenres = document.querySelector(".highlight__genres");
         const highlightLaunch = document.querySelector(".highlight__launch");
         const highlightDescription = document.querySelector(
            ".highlight__description"
         );
         const highlightVideoLink = document.querySelector(
            ".highlight__video-link"
         );

         highlightVideo.style.backgroundImage = `url('${content.backdrop_path}')`;
         highlightTitle.textContent = content.title;
         highlightRating.textContent = content.vote_average.toFixed(1);

         let genre = "";
         content.genres.forEach((genreList) => {
            genre += `${genreList.name}, `;
         });
         highlightGenres.textContent = genre;

         const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
         };
         const date = new Date(content.release_date);
         highlightLaunch.textContent = date.toLocaleDateString(
            "pt-BR",
            options
         );

         highlightDescription.textContent = content.overview;

         fetch(
            `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`
         ).then((responseFetch) => {
            const promiseVideo = responseFetch.json();

            promiseVideo.then((content) => {
               highlightVideoLink.href = `https://www.youtube.com/watch?v=${content.results[0].key}`;
            });
         });
      });
   });
}

input.addEventListener("keydown", (event) => {
   const userInput = event.target.value.toLowerCase();
   for (const item of catalog) {
      item.shift();
   }
   if (event.key !== "Enter") return;

   if (input.value === "") {
      clearMoviesDiv();
      searchMovies();
   } else {
      clearMoviesDiv();
      searchMovies(userInput);
   }
   input.value = "";
});
function clearMoviesDiv() {
   const moviesFromHTML = document.querySelectorAll(".movie");

   for (const item of moviesFromHTML) {
      item.remove();
   }
}

function openImage(id) {
   modal.classList.remove("hidden");
   fetchModal(id);
}

function closeModal() {
   modal.classList.add("hidden");
   resetGenres();
   modalImg.src = "";
}

function resetGenres() {
   const resetGenres = document.querySelectorAll(".modal__genre");
   resetGenres.forEach((genre) => {
      genre.remove();
   });
}

function fetchModal(idMovie) {
   const link = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idMovie}?language=pt-BR`;

   fetch(link).then((responseFetch) => {
      const promiseBody = responseFetch.json();

      promiseBody.then((content) => {
         modalTitle.textContent = content.title;
         modalImg.src = content.backdrop_path;
         modalDescription.textContent = content.overview;
         modalAverage.textContent = content.vote_average.toFixed(1);

         content.genres.forEach((element) => {
            const genre = document.createElement("span");
            genre.classList.add("modal__genre");
            genre.textContent = `${element.name}`;
            modalGenres.append(genre);
         });
      });
   });
}
