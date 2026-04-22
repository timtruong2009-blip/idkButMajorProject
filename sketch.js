// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let startScreen;
let myFont;

let gamePhrase  = "start";

function preload(){
  myFont = loadFont("screen image/saiba.ttf");
  startScreen = loadImage("screen image/Baguette start screen.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth();
}

function draw() {
  background("white");
  if (gamePhrase === "start"){
    mainScreen();
  }

}
