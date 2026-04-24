// Baguette Mayhem
// Tim Truong
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQvMEmYIfl60Rz-TaDhjv2jheR3iq4thA",
  authDomain: "compsci30.firebaseapp.com",
  projectId: "compsci30",
  storageBucket: "compsci30.firebasestorage.app",
  messagingSenderId: "785998879392",
  appId: "1:785998879392:web:afdd4ecbb5d9a3d87987c5",
  measurementId: "G-7RQ0TZM4SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
  if (gamePhrase === "start"){
    mainScreen();
  }
  if (gamePhrase === "Map"){
    makingMapScreen();
  }
  // s
}

function mousePressed(){
  if (gamePhrase === "start"){
    for (let button of allButton){
      if (button.hover()){
        switchPhrase(button.word);;
      }
    }
  }
}


function switchPhrase(name){
  if (name === "Campaign"){
    gamePhrase = "Campaign";
  }
  else if (name === "Custom"){
    gamePhrase = "Custom";
  }
  if (name === "Setting"){
    gamePhrase = "Setting";
  }
  if (name === "Zombie"){
    gamePhrase = "Zombie";
  }
  if (name === "Map"){
    gamePhrase = "Map";
  }

}




