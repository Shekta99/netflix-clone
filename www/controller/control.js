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
    socket.emit("search", resultado);
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

const socket = io();

const downButton = document.getElementById("down");

downButton.onclick = () => {
  socket.emit("down");
};

const upButton = document.getElementById("up");

upButton.onclick = () => {
  socket.emit("up");
};

const logo = document.getElementById("logo");

logo.onclick = () => {
  socket.emit("home");
};

const home = document.getElementById("home-link");

home.onclick = () => {
  socket.emit("home");
};

const tvshow = document.getElementById("tvshow");

tvshow.onclick = () => {
  socket.emit("tvshow");
};

const movies = document.getElementById("movies");

movies.onclick = () => {
  socket.emit("movies");
};

const originals = document.getElementById("originals");

originals.onclick = () => {
  socket.emit("originals");
};

const play = document.getElementById("play");

play.onclick = () => {
  socket.emit("play");
};

const pause = document.getElementById("pause");

pause.onclick = () => {
  socket.emit("pause");
};

const subirVolume = document.getElementById("subir_volume");

subirVolume.onclick = () => {
  socket.emit("subir_volume");
};

const bajarVolume = document.getElementById("bajar_volume");

bajarVolume.onclick = () => {
  socket.emit("bajar_volume");
};

const mutearVolume = document.getElementById("mutear_volume");

mutearVolume.onclick = () => {
  socket.emit("mutear_volume");
};

const adelantarVideo = document.getElementById("adelantar_video");

adelantarVideo.onclick = () => {
  socket.emit("adelantar_video");
};

const retrasarVideo = document.getElementById("retrasar_video");

retrasarVideo.onclick = () => {
  socket.emit("retrasar_video");
};

let started = false;
let accelerometer;
let absOrientation;

async function toggleStart() {
  started = !started;
  if (started) {
    document.documentElement.requestFullscreen();
    const button = document.getElementById("Empezar_ejercicio");
    button.innerHTML = "Parar ejercicio";
    //await screen.orientation.lock("portrait");
    if (accelerometer) accelerometer.start();
    if (absOrientation) absOrientation.start();
  } else {
    //await screen.orientation.unlock();
    document.exitFullscreen();
    const button = document.getElementById("Empezar_ejercicio");
    button.innerHTML = "Empezar ejercicio";
    if (accelerometer) accelerometer.stop();
    if (absOrientation) absOrientation.stop();
  }
}
const botonLike = document.getElementById("Like");

botonLike.onclick = () => {
  socket.emit("like_video");
};

const botonSiguiente = document.getElementById("right");

botonSiguiente.onclick = () => {
  socket.emit("next_video");
};

const botonAnterior = document.getElementById("left");

botonAnterior.onclick = () => {
  socket.emit("previous_video");
};

const botonSelect = document.getElementById("Select");

botonSelect.onclick = () => {
  socket.emit("select");
};
const botonEjercicio = document.getElementById("Empezar_ejercicio");

botonEjercicio.addEventListener("click", toggleStart);

if ("Accelerometer" in window) {
  try {
    accelerometer = new Accelerometer({ frequency: 10 });
    accelerometer.onerror = (event) => {
      // Errores en tiempo de ejecución
      if (event.error.name === "NotAllowedError") {
        alert("Permission to access sensor was denied.");
      } else if (event.error.name === "NotReadableError") {
        alert("Cannot connect to the sensor.");
      }
    };
    accelerometer.onreading = (e) => {
      socket.emit("ACC_DATA", {
        x: accelerometer.x,
        y: accelerometer.y,
        z: accelerometer.z,
      });
    };
  } catch (error) {
    // Error en la creación del objeto
    if (error.name === "SecurityError") {
      alert("Sensor construction was blocked by the Permissions Policy.");
    } else if (error.name === "ReferenceError") {
      alert("Sensor is not supported by the User Agent.");
    } else {
      throw error;
    }
  }
}

if ("AbsoluteOrientationSensor" in window) {
  try {
    absOrientation = new AbsoluteOrientationSensor({ frequency: 10 });

    absOrientation.onreading = (e) => {
      const quat = e.target.quaternion;
      const angles = toEulerRollPitchYaw(quat);

      socket.emit("ORIENTATION_DATA", {
        roll: angles.roll,
        pitch: angles.pitch,
        yaw: angles.yaw,
      });
    };
  } catch (err) {
    console.log(err);
  }
}

function toEulerRollPitchYaw(q) {
  const sinr_cosp = 2 * (q[3] * q[0] - q[1] * q[2]);
  const cosr_cosp = 1 - 2 * (q[0] * q[0] + q[1] * q[1]);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  const sinp = Math.sqrt(1 + 2 * (q[3] * q[1] - q[0] * q[2]));
  const cosp = Math.sqrt(1 - 2 * (q[3] * q[1] + q[0] * q[2]));
  const pitch = 2 * Math.atan2(sinp, cosp) - Math.PI / 2;

  const siny_cosp = 2 * (q[3] * q[2] + q[0] * q[1]);
  const cosy_cosp = 1 - 2 * (q[1] * q[1] + q[2] * q[2]);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return { roll, pitch, yaw };
}
