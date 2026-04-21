// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let startScreen;

function preload(){
  startScreen = loadImage("screen image/Baguette start screen.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("white");
  image(startScreen, 0,0, windowWidth, windowHeight);
}
