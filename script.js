// ===== QUIZ ESPACIAL =====
const quizQuestions = [
  { q: "¿Qué significa HTML?", a: "Lenguaje de marcado de hipertexto", o: ["Lenguaje de marcado de hipertexto", "Hoja de estilos", "Lenguaje de programación"] },
  { q: "¿Cuál propiedad CSS cambia el color del texto?", a: "color", o: ["font-size", "background", "color"] },
  { q: "¿Con qué etiqueta se inserta JavaScript?", a: "<script>", o: ['<js>', '<javascript>', '<script>'] }
];

function initializeQuiz() {
  const quizDiv = document.getElementById("quiz");
  if (quizDiv) {
    quizDiv.innerHTML = ''; // Limpiar contenido previo
    quizQuestions.forEach((item, i) => {
      let html = `<p><b>${item.q}</b></p>`;
      item.o.forEach(opt => {
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;
      });
      quizDiv.innerHTML += html;
    });

    const quizSubmitBtn = document.getElementById("quizSubmit");
    if (quizSubmitBtn) {
      quizSubmitBtn.onclick = () => {
        let score = 0;
        quizQuestions.forEach((q, i) => {
          const ans = document.querySelector(`input[name="q${i}"]:checked`);
          if (ans && ans.value === q.a) score++;
        });
        document.getElementById("quizResult").innerText = `Tu puntuación: ${score}/${quizQuestions.length}`;
      };
    }
  }
}

// ===== ATRAPA LA ESTRELLA =====
let estrellaGameInterval; // Para controlar el bucle del juego
let estrellaScore = 0;
let star = { x: 0, y: 0 };
let canvas, ctx;

function initializeEstrellaGame() {
  canvas = document.getElementById("estrellaGame");
  if (canvas) {
    ctx = canvas.getContext("2d");
    estrellaScore = 0; // Resetear puntuación al iniciar
    document.getElementById("estrellaScore").innerText = "Estrellas atrapadas: " + estrellaScore;

    function drawStar(x, y) {
      ctx.fillStyle = "#ff0";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    function resetStar() {
      star.x = Math.random() * (canvas.width - 20) + 10;
      star.y = Math.random() * (canvas.height - 20) + 10;
    }

    // Limpiar listeners previos para evitar duplicados
    canvas.removeEventListener("mousemove", handleEstrellaMouseMove);
    canvas.addEventListener("mousemove", handleEstrellaMouseMove);

    function handleEstrellaMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      if (Math.hypot(mx - star.x, my - star.y) < 15) {
        estrellaScore++;
        resetStar();
      }
    }

    function gameLoop() {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStar(star.x, star.y);
      document.getElementById("estrellaScore").innerText = "Estrellas atrapadas: " + estrellaScore;
      estrellaGameInterval = requestAnimationFrame(gameLoop);
    }

    resetStar();
    gameLoop();
  }
}

function stopEstrellaGame() {
  if (estrellaGameInterval) {
    cancelAnimationFrame(estrellaGameInterval);
    estrellaGameInterval = null;
  }
  if (canvas) {
    canvas.removeEventListener("mousemove", handleEstrellaMouseMove);
  }
}


// ===== ROMPECÓDIGOS =====
const piecesData = ["<p>", "Hola mundo", "</p>"];

function initializeRompecodigos() {
  const piecesContainer = document.getElementById("pieces");
  const target = document.getElementById("target");
  const rompeResult = document.getElementById("rompeResult");

  if (piecesContainer && target && rompeResult) {
    piecesContainer.innerHTML = ''; // Limpiar contenido previo
    target.innerHTML = ''; // Limpiar contenido previo
    rompeResult.innerText = ''; // Limpiar resultado previo

    piecesData.forEach((txt, i) => {
      const div = document.createElement("div");
      div.className = "piece";
      div.innerText = txt;
      div.draggable = true;
      div.id = "piece" + i;
      div.ondragstart = (e) => { e.dataTransfer.setData("text", e.target.id); };
      piecesContainer.appendChild(div);
    });

    target.ondragover = (e) => { e.preventDefault(); };
    target.ondrop = (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text");
      const el = document.getElementById(id);
      if (el && el.parentNode === piecesContainer) { // Asegurarse de que la pieza viene del contenedor original
        target.appendChild(el);
        if (target.children.length === 3) {
          const code = Array.from(target.children).map(c => c.innerText).join("");
          rompeResult.innerText =
            (code === "<p>Hola mundo</p>") ? "✅ ¡Correcto!" : "❌ Intenta de nuevo.";
        }
      }
    };
  }
}


// Funcionalidad para mostrar/ocultar juegos
function showGame(gameId) {
  // Ocultar todos los juegos primero
  document.querySelectorAll('.game-container').forEach(container => {
    container.style.display = 'none';
  });

  // Detener el juego de la estrella si está corriendo
  stopEstrellaGame();

  // Mostrar el juego seleccionado
  const gameElement = document.getElementById(gameId);
  if (gameElement) {
    gameElement.style.display = 'block';
    if (gameId === 'quizGame') {
      initializeQuiz();
    } else if (gameId === 'estrellaGameContainer') {
      initializeEstrellaGame();
    } else if (gameId === 'rompecodigosGame') {
      initializeRompecodigos();
    }
  }
}

function hideGame(gameId) {
  const gameElement = document.getElementById(gameId);
  if (gameElement) {
    gameElement.style.display = 'none';
    if (gameId === 'estrellaGameContainer') {
      stopEstrellaGame();
    }
  }
}


// Funcionalidad de Modales para Planetas de Conocimiento
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
}


// Starfield background (mantener si se usa un canvas para esto, si no, las clases CSS ya lo manejan)
const starfieldCanvas = document.getElementById('starfield');
if (starfieldCanvas) {
  const ctx = starfieldCanvas.getContext('2d');
  let stars = [];
  const numStars = 500;

  function resizeCanvas() {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * starfieldCanvas.width,
        y: Math.random() * starfieldCanvas.height,
        radius: Math.random() * 1.5,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25,
        alpha: Math.random()
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    ctx.fillStyle = 'white';
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.globalAlpha = star.alpha;
      ctx.fill();
    });
  }

  function updateStars() {
    stars.forEach(star => {
      star.x += star.vx * 0.001;
      star.y += star.vy * 0.001;

      if (star.x < 0 || star.x > starfieldCanvas.width) star.vx *= -1;
      if (star.y < 0 || star.y > starfieldCanvas.height) star.vy *= -1;

      star.alpha += (Math.random() - 0.5) * 0.05;
      if (star.alpha > 1) star.alpha = 1;
      if (star.alpha < 0) star.alpha = 0;
    });
  }

  function animateStars() {
    updateStars();
    drawStars();
    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateStars();
}

// Background music
const bgm = document.getElementById('bgm');
if (bgm) {
  bgm.volume = 0.3; // Adjust volume as needed
  bgm.play().catch(e => console.log("Autoplay prevented:", e));
}

// Inicializar los juegos cuando la página carga, pero ocultos
document.addEventListener('DOMContentLoaded', () => {
  // No inicializamos los juegos aquí, solo cuando se muestran
  // Esto evita que los juegos se ejecuten en segundo plano si no son visibles.
});
