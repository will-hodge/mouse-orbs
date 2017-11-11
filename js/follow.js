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

window.onload = function() {
  initialize();
}

function initialize() {
  initialized = true;
  canvas = document.getElementById('screen');
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  context = canvas.getContext('2d');
  context.font = "100px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Click", canvas.width/2, canvas.height/2);
}

function start() {
  if (started == true){
    return;
  }
  started = true;
  document.addEventListener('mousemove', moveMouseHandler, false);
  window.addEventListener('resize', resizeHandler, false);

  moveMouseHandler(event);
  createParticles();
  resizeHandler();
  setInterval(run, 1000 / 60);
}

function createParticles() {
  particles = [];

  for (var i = 0; i < QUANTITY; i++) {
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
      fillColor: '#' + (Math.random(Math.random() * 3) * 0xdddddd | 0).toString(16),
      orbit: RADIUS * .5 + (RADIUS * Math.random() * 3)
    };

    particles.push(particle);
  }
}

function moveMouseHandler(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

function resizeHandler() {
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
}

function run() {
  context.fillStyle = 'rgba(0, 0, 0, 0.08)';
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (i = 0; i < particles.length; i++) {
    var particle = particles[i];

    var oldPosition = {
      x: particle.position.x,
      y: particle.position.y
    };

    particle.angle += particle.speed;

    particle.shift.x += (mouseX - particle.shift.x) * particle.speed;
    particle.shift.y += (mouseY - particle.shift.y) * particle.speed;

    particle.position.x = particle.shift.x + Math.cos( i + particle.angle)
                          * particle.orbit;
    particle.position.y = particle.shift.y + Math.sin( i + particle.angle)
                          * particle.orbit;


    if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
      particle.targetSize = 1 + Math.random() * 10;
    }
    context.beginPath();
    context.fillStyle = particle.fillColor;
    context.strokeStyle = particle.fillColor;
    context.lineWidth = particle.size;
    context.moveTo(oldPosition.x, oldPosition.y);
    context.lineTo(particle.position.x, particle.position.y);
    context.stroke();
    context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
    context.fill();
  }
}
