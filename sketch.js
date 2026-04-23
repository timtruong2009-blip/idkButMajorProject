// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let startScreen;
let myFont;

let gamePhrase  = "start";
let allButton = [];

let buttonName = ["Campaign", "Custom","Setting", "Zombie", "Map"];


function preload(){
  myFont = loadFont("screen image/Debrosee.ttf");
  startScreen = loadImage("screen image/Baguette start screen.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth();
  makeButton();
}

function draw() {
  background(255);
  createCanvas(windowWidth, windowHeight);

  if (gamePhrase === "start"){
    mainScreen();
    makeButton();
  }
}
