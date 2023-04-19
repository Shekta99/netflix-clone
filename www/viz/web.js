//variables para el speech api
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//definición de la gramatica
const peliculas = ["scary"];
const grammar = `#JSGF V1.0; grammar peliculas; public <peliculas> = ${peliculas.join(
  " | "
)};`;

//definicion del reconocimiento de voz
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);

//Configuraciones adicionales
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//iniciando reconocimiento cuando se use el input de buscar
const searchMicro = document.getElementById("search-micro");
searchMicro.onclick = () => {
  recognition.start();
};

//procesando resultado
recognition.onresult = (event) => {
  const busqueda = event.results[0][0].transcript;
  console.log(`Result received: ${busqueda}.`);
  console.log(busqueda.substring(0, busqueda.length - 1));
  const resultado = busqueda.substring(0, busqueda.length - 1).toLowerCase();
  document.getElementById("search-bar").setAttribute("value", resultado);
  if (resultado) {
    createSection("Results", resultado);
  }
};

//parando luego de escuchar una palabra
recognition.onspeechend = () => {
  recognition.stop();
};

//si no reconoce nada
recognition.onnomatch = (event) => {
  console.log("I didn't recognize that word.");
};

//variables de la app
let movies = [];
let focusElement = 0;

if (window.localStorage.getItem("movies")) {
  movies = JSON.parse(window.localStorage.getItem("movies"));
} else {
  fetch("movies.json")
    .then((response) => response.text())
    .then((text) => {
      movies = JSON.parse(text);
      window.localStorage.setItem("movies", JSON.stringify(movies));
      mainPage();
    });
}
const socket = io();

socket.on("down", () => {
  scrollBy(0, 100);
});

socket.on("search", (data) => {
  console.log(data);
  if (data) {
    document.getElementById("search-bar").setAttribute("value", data);
    createSection("Results", data);
  }
});

socket.on("up", () => {
  scrollBy(0, -100);
});

socket.on("home", () => {
  mainPage();
});

socket.on("tvshow", () => {
  window.location.assign("/viz/index.html#tvShows");
});

socket.on("movies", () => {
  window.location.assign("/viz/index.html#movies");
});

socket.on("originals", () => {
  window.location.assign("/viz/index.html#originals");
});

socket.on("play", () => {
  document.getElementById("player").click();
  if (playVideo) {
    playVideo();
  }
});

socket.on("pause", () => {
  if (pauseVideo) {
    pauseVideo();
  }
});

socket.on("subir_volume", () => {
  if (subirVolume) {
    subirVolume();
  }
});

socket.on("bajar_volume", () => {
  if (bajarVolume) {
    bajarVolume();
  }
});

socket.on("mutear_volume", () => {
  if (mutearVolume) {
    mutearVolume();
  }
});

socket.on("adelantar_video", () => {
  if (adelantarVideo) {
    adelantarVideo();
  }
});

socket.on("retrasar_video", () => {
  if (retrasarVideo) {
    retrasarVideo();
  }
});

socket.on("ACC_DATA", function (data) {
  const movement = updateMovement(data.x, data.y, data.z);
  if (!movement) {
    pauseVideo();
  } else {
    playVideo();
  }
});

socket.on("like_video", () => {
  const likeButton = document.getElementById("like");
  if (likeButton) {
    likeButton.click();
  }
});

socket.on("previous_video", () => {
  focusMovie("previous");
});

socket.on("next_video", () => {
  focusMovie("next");
});

socket.on("select", () => {
  if (focusElement !== 0) {
    document.images[focusElement].parentElement.click();
  }
});

let playVideo = null;
let pauseVideo = null;
let player = null;
let subirVolume = null;
let bajarVolume = null;
let mutearVolume = null;
let adelantarVideo = null;
let retrasarVideo = null;
let initialData = { x: 0, y: 0, z: 0 };

const searchButton = document.getElementById("search-button");

function focusMovie(operation) {
  const currentFocus = focusElement;
  if (operation === "next") {
    if (document.images.length > focusElement + 1) {
      focusElement += 1;
    }
  } else if (operation === "previous") {
    if (focusElement - 1 > 0) {
      focusElement -= 1;
    }
  }
  if (focusElement !== 0) {
    document.images[currentFocus].parentElement.parentElement.style =
      "transition: transform 0.3s; -ms-transform: scale(1); -webkit-transform: scale(1);transform: scale(1);";
    document.images[focusElement].parentElement.parentElement.style =
      "transition: transform 0.3s; -ms-transform: scale(1.4); -webkit-transform: scale(1.4);transform: scale(1.4);";
    window.scrollTo(
      0,
      document.images[focusElement].parentElement.parentElement.offsetTop - 120
    );
  }
}

function mainPage() {
  let params = new URLSearchParams(document.location.search);
  let video = params.get("video");
  if (video) {
    window.location.assign("/viz/index.html");
  }
  document.images[focusElement].parentElement.parentElement.style =
    "transition: transform 0.3s; -ms-transform: scale(1); -webkit-transform: scale(1);transform: scale(1);";
  focusElement = 0;
  scrollTo(0, 0);
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";
  const player = document.querySelector("#player");
  player.innerHTML = "";
  createSection("Popular on Netflix", null);
  createSection("Trending Now", null);
  createSection("TV Shows", null);
  createSection("Blockbuster Action & Adventure", null);
  createSection("Netflix Originals", null);
  focusMovie();
}

const updateMovement = (x, y, z) => {
  if (initialData.x === 0 && initialData.y === 0 && initialData.z === 0) {
    initialData.x = x;
    initialData.y = y;
    initialData.z = z;
    return true;
  } else {
    if (
      Math.abs(initialData.x) - Math.abs(x) > 1 ||
      Math.abs(initialData.x) - Math.abs(x) < -1 ||
      Math.abs(initialData.y) - Math.abs(y) > 1 ||
      Math.abs(initialData.y) - Math.abs(y) < -1 ||
      Math.abs(initialData.z) - Math.abs(z) > 1 ||
      Math.abs(initialData.z) - Math.abs(z) < -1
    ) {
      initialData.x = x;
      initialData.y = y;
      initialData.z = z;
      return true;
    } else {
      return false;
    }
  }
};

const logo = document.getElementById("logo");
logo.onclick = mainPage;

const home = document.getElementById("home");
home.onclick = mainPage;

const chargeMovie = (video) => {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";
  const container = document.getElementById("main-container");
  const likeIcon = document.createElement("a");
  likeIcon.setAttribute("id", "like");
  container.style = "text-align:center";
  const currentMovie = movies.filter((movie) => movie.link === video)[0];
  if (currentMovie.like) {
    likeIcon.innerHTML = "💖";
  } else {
    likeIcon.innerHTML = "🤍";
  }
  likeIcon.onclick = () => {
    if (likeIcon.textContent === "🤍") {
      movies = movies.map((movie) => {
        if (movie.link === video) {
          return { ...movie, like: true };
        } else {
          return movie;
        }
      });
      window.localStorage.setItem("movies", JSON.stringify(movies));
      likeIcon.innerHTML = "💖";
    } else {
      movies = movies.map((movie) => {
        if (movie.link === video) {
          return { ...movie, like: false };
        } else {
          return movie;
        }
      });
      likeIcon.innerHTML = "🤍";
      window.localStorage.setItem("movies", JSON.stringify(movies));
    }
  };
  container.appendChild(likeIcon);
};

const createMovie = (src, alt, link, like) => {
  const container = document.createElement("a");
  const a = document.createElement("a");
  const image = document.createElement("img");
  const likeIcon = document.createElement("a");
  if (like) {
    likeIcon.innerHTML = "💖";
  } else {
    likeIcon.innerHTML = "🤍";
  }
  image.setAttribute("src", src);
  image.setAttribute("alt", alt);
  a.setAttribute("href", `/viz/index.html?video=${link}`);
  a.appendChild(image);

  likeIcon.onclick = () => {
    if (likeIcon.textContent === "🤍") {
      movies = movies.map((movie) => {
        if (movie.alt == alt && movie.src == src && movie.link == link) {
          return { ...movie, like: true };
        } else {
          return movie;
        }
      });
      window.localStorage.setItem("movies", JSON.stringify(movies));
      likeIcon.innerHTML = "💖";
    } else {
      movies = movies.map((movie) => {
        if (movie.alt == alt && movie.src == src && movie.link == link) {
          return { ...movie, like: false };
        } else {
          return movie;
        }
      });
      likeIcon.innerHTML = "🤍";
      window.localStorage.setItem("movies", JSON.stringify(movies));
    }
  };
  container.appendChild(a);
  container.appendChild(likeIcon);
  return container;
};

const createSection = (title, value) => {
  const mainContainer = document.querySelector(".main-container");
  if (title == "Results") {
    mainContainer.innerHTML = "";
  }
  const h1 = document.createElement("h1");

  if (title == "TV Shows") {
    h1.setAttribute("id", "tvShows");
  } else if (title == "Blockbuster Action & Adventure") {
    h1.setAttribute("id", "movies");
  } else if (title == "Netflix Originals") {
    h1.setAttribute("id", "originals");
  } else {
    h1.setAttribute("id", "myList");
  }

  h1.innerText = title;
  const div = document.createElement("div");
  div.setAttribute("class", "box");
  mainContainer.appendChild(h1);
  if (title == "Results") {
    const filter = movies.filter((movie) =>
      movie.alt.search(value) === -1 ? false : true
    );
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }
  if (title == "Popular on Netflix") {
    const filter = movies.filter(
      (movie) => movie.section === "Popular on Netflix"
    );
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }

  if (title == "Trending Now") {
    const filter = movies.filter((movie) => movie.section === "Trending Now");
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }

  if (title == "TV Shows") {
    const filter = movies.filter((movie) => movie.section === "TV Shows");
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }

  if (title == "Blockbuster Action & Adventure") {
    const filter = movies.filter(
      (movie) => movie.section === "Blockbuster Action & Adventure"
    );
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }

  if (title == "Netflix Originals") {
    const filter = movies.filter(
      (movie) => movie.section === "Netflix Originals"
    );
    filter.forEach((movie) => {
      const a = createMovie(movie.src, movie.alt, movie.link, movie.like);
      div.appendChild(a);
    });
  }
  mainContainer.appendChild(div);
};

const search = () => {
  const searchBar = document.getElementById("search-bar");
  const value = searchBar.value;
  if (value) {
    createSection("Results", value);
  }
};

searchButton.onclick = search;

let params = new URLSearchParams(document.location.search);
let video = params.get("video");
console.log(video);
if (video) {
  chargeMovie(video);
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: "M7lc1UVf-VE",
      playerVars: {
        autoplay: 1,
        enablejsapi: 1,
        playsinline: 1,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    pauseVideo = () => {
      player.pauseVideo();
    };
    playVideo = () => {
      player.playVideo();
    };

    subirVolume = () => {
      player.unMute();
      volumen_actual = player.getVolume();
      volumen_nuevo = volumen_actual + 10;
      player.setVolume(volumen_nuevo);
    };

    bajarVolume = () => {
      volumen_actual = player.getVolume();
      volumen_nuevo = volumen_actual - 10;
      player.setVolume(volumen_nuevo);
    };
    mutearVolume = () => {
      if (player.isMuted()) {
        player.unMute();
      } else {
        player.mute();
      }
    };
    adelantarVideo = () => {
      tiempo_actual = player.getCurrentTime();
      tiempo_nuevo = tiempo_actual + 15;
      player.seekTo(tiempo_nuevo);
    };
    retrasarVideo = () => {
      tiempo_actual = player.getCurrentTime();
      tiempo_nuevo = tiempo_actual - 15;
      player.seekTo(tiempo_nuevo);
    };
  }
} else {
  mainPage();
}
