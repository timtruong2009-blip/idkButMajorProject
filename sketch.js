// Baguette Mayhem
// Tim Truong
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBQvMEmYIfl60Rz-TaDhjv2jheR3iq4thA",
//   authDomain: "compsci30.firebaseapp.com",
//   projectId: "compsci30",
//   storageBucket: "compsci30.firebasestorage.app",
//   messagingSenderId: "785998879392",
//   appId: "1:785998879392:web:afdd4ecbb5d9a3d87987c5",
//   measurementId: "G-7RQ0TZM4SB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

let startScreen;
let campaignscreen;
let myFont;

let gamePhrase  = "start";
let allButton = [];

let buttonName = ["Campaign", "Custom","Setting", "Zombie", "Map"];
let allCampaignButton = [];

let campaignLevel = ["map_list/examplemap.json", "map_list/jungle map.json", "map_list/goodmap.json", "map_list/leo's cat.json", "map_list/kevin.json", "map_list/betaTest.json"];
let campaignMapData = [];

let weaponList = [{type: "weapon/cheese.png", bull : "weapon/cheese.png"},
  {type: "weapon/cheese.png", bull : "weapon/cheese.png"},
  {type: "weapon/pizza weapon.png", bull : "weapon/pizza weapon.png"},
  {type: "weapon/gun.png", bull : "weapon/bullet.png"},
  {type: "weapon/banana.png", bull : "weapon/bananaBullet.png"}
];

let weaponData = [];

let map = [];
const GRIDSIZE = 32;
const MAPHEIGHT = 30;
const MAPWIDTH = 60;

const REALGRIDSIZE = 50;

let deathY = 3000;

let currentBlockColor;

let player;
let playerImg;
let bot;

const GRAVITY = 1;

let cheese;
let pizza;
let pistol;
let bullet;

let everyMovingThing = [];
let bulletList = [];
let everyCrate = [];

let allWeapon = [];

let doorDashCrate;
let abosluteFreeze = 0;
const crateSpawnSpeed = 1000;
let crateMillis = 0;


function preload(){
  myFont = loadFont("screen image/Debrosee.ttf");

  startScreen = loadImage("screen image/Baguette start screen.png");
  campaignscreen = loadImage("screen image/campaignplan.png");

  for (let item of campaignLevel){
    let mapy = loadJSON(item);
    campaignMapData.push(mapy);
  }
  
  // for (){

  // }
  playerImg = loadImage("character/baguette.png");

  doorDashCrate = loadImage("character/doordash.png")

  cheese = loadImage("weapon/cheese.png");
  allWeapon.push("cheese");

  pizza = loadImage("weapon/pizza weapon.png");
  allWeapon.push("pizza");

  pistol = loadImage("weapon/gun.png");
  allWeapon.push("pistol");
  
  gunBullet = loadImage("weapon/bullet.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth();
  makeButton();
}

function draw() {
  resizeCanvas(windowWidth, windowHeight);
  background(255);
  if (gamePhrase === "start"){
    mainScreen();
  }
  if (gamePhrase === "Campaign"){
    MapCampaign();
  }
  if (gamePhrase === "Map"){
    makingMapScreen();
  }
  if (gamePhrase === "battle"){
    fightStart();
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
  else if (gamePhrase === "Map"){
  }
  else if (gamePhrase === "Campaign"){
    for (let num = 0; num < allCampaignButton.length; num ++){
      if (allCampaignButton[num].hover()){
        loadMap(campaignLevel[num]);
      }
    }
  }
}

function keyPressed(){
  if (key === "b"){
    gamePhrase = "start";
  }
  if (gamePhrase === "Campaign"){
  }
  else if (gamePhrase === "Custom"){

  }
  if (gamePhrase === "Setting"){

  }
  if (gamePhrase === "Zombie"){

  }
  if (gamePhrase === "battle"){
    if (key === "s"){
      player.moveDown();
    }
    // if (key === "f"){
    //   abosluteFreeze = player.platformY;
    // }
    if (keyCode === 87){
      player.playerJump();
    }
  }
  
  if (gamePhrase === "Map"){
    if (key === "c"){
      currentBlockColor.currentDisplay = !currentBlockColor.currentDisplay;
    }
    if (key === "s"){
      saveJSON(map, "newmap.json");
    }
    if (key === "e"){
      mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};
      map[mouse_press_pos.y][mouse_press_pos.x] = 0;
    }
    if (key === "o"){
      makeNewMap();
    }
  }
}


function switchPhrase(name){
  if (name === "Campaign"){
    gamePhrase = "Campaign";
    loadingGameMap();
    for (let level = 1; level <= campaignLevel.length; level ++){
      loadLevelText(level);
    }
  }
  else if (name === "battle"){
    gamePhrase = "battle";
    
    player = new PlayerBaguette();
    player.currentWeapon = new Pistol();
    
    bot = new BotPlayer();
    bot.currentWeapon = new Pistol();

    everyMovingThing.push(bot);
    everyMovingThing.push(player);

    crateMillis = millis();
    
  }

  else if (name === "Custom"){
    gamePhrase = "Custom";
  }
  else if (name === "Setting"){
    gamePhrase = "Setting";
  }
  else if (name === "Zombie"){
    gamePhrase = "Zombie";
  }
  else if (name === "Map"){
    push();
    fill(200);
    makeNewMap();
    pop();
    gamePhrase = "Map";
    currentBlockColor = new CurrentBlockColor();
  }
}

function makeNewMap(){
  map = [];
  for (let y = 0; y <= MAPHEIGHT; y ++){
    let row_x = [];
    for (let x = 0; x <= MAPWIDTH; x ++){  
      row_x.push(floor(random(2.99))) ;  
    }                  
    map.push(row_x);                  
  }
}



