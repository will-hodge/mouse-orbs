/* initializers for when page loads */
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var RADIUS = 50;

var QUANTITY = 50;

var canvas;
var context;
var particles;

var mouseX = 0;
var mouseY = 0;
var started = false;
var mouseDown = false;
var particles = [];

window.onload = function() {
  initialize();
}

function initialize() {
  canvas = document.getElementById('screen');
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  /* creates Click prompt */
  context = canvas.getContext('2d');
  context.font = "100px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Click", canvas.width / 2, canvas.height / 2);
}

function start(e) {
  if (started == true) {
    return;
  }
  started = true;

  document.addEventListener('mousemove', moveMouseHandler, false);
  document.addEventListener('mousedown', updateParticles, false);
  document.addEventListener('mouseup', updateParticles, false);
  window.addEventListener('resize', resizeHandler, false);

  moveMouseHandler(e);
  createParticles();
  resizeHandler();
  setInterval(run, 15);
}

function createParticles() {

  for (var i = 0; i < QUANTITY; i++) {
    /* particle object contains all necessary information for each rotation object */
    var particle = {
      position: {
        x: mouseX,
        y: mouseY
      },
      angle: 0,
      size: 1 + (Math.random() * 5),
      shift: {
        x: mouseX,
        y: mouseY
      },
      speed: Math.random() * 0.08 + 0.01,

      /* my attempt at ensuring the color of the particle is aesthetically pleasing */
      fillColor: '#' + (Math.random(Math.random() * 3) * 0xdddddd | 0).toString(16),
      orbit: RADIUS * .5 + (RADIUS * Math.random() * 3)
    };

    particles.push(particle);
  }
}

/* adjusts the mouseX/Y coordinates when mouse moves */
function moveMouseHandler(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

/* adjusts canvas dimensions upon screen resize */
function resizeHandler(event) {
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
}

function run() {
  /* how fast the color is overwritten by black background */
  context.fillStyle = 'rgba(0, 0, 0, 0.08)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (i = 0; i < particles.length; i++) {
    var particle = particles[i];

    var oldPosition = {
      x: particle.position.x,
      y: particle.position.y
    };

    /* adjusts the angle, shift, and position of each particle */
    particle.angle += particle.speed;

    particle.shift.x += (mouseX - particle.shift.x) * particle.speed;
    particle.shift.y += (mouseY - particle.shift.y) * particle.speed;

    particle.position.x = particle.shift.x + Math.cos(i + particle.angle) *
                          particle.orbit;
    particle.position.y = particle.shift.y + Math.sin(i + particle.angle) *
                          particle.orbit;

    /* movement of the particle using the canvas moveTo/lineTo/stroke methods */
    context.beginPath();
    context.fillStyle = particle.fillColor;
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(oldPosition.x, oldPosition.y);
    context.lineTo(particle.position.x, particle.position.y);
    context.stroke();
    context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
    context.fill();
  }
}

/* when clicked, update the speed of the particles */
function updateParticles(e) {
  mouseDown = !(mouseDown);
  for (i = 0; i < particles.length; i++) {
    var particle = particles[i];
    if (mouseDown) {
      particle.speed = particle.speed / 4;
    } else {
      particle.speed = particle.speed * 4;
    }
  }
}
