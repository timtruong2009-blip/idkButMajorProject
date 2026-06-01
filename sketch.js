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
let customDemo;
let myFont;

let gamePhrase  = "start";
let allButton = [];
let sliderButton = [];

let buttonName = ["Campaign", "Custom","Guide", "Zombie", "Map"];
let allCampaignButton = [];

let campaignLevel = ["map_list/examplemap.json", "map_list/jungle map.json", "map_list/goodmap.json", "map_list/leo's cat.json", "map_list/kevin.json"];
let campaignMapData = [];

let weaponList = [{type: "weapon/cheese.png", bull : "weapon/cheese.png", name: "cheese"},
  {type: "weapon/pizza weapon.png", bull : "weapon/pizza weapon.png", name: "pizza"},
  {type: "weapon/gun.png", bull : "weapon/bullet.png", name: "pistol"},
  {type: "weapon/banana.png", bull : "weapon/bananaBullet.png", name: "banana"}
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
let player2;

let playerImg;

let bot;
let botImg;

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
let crateSpawnSpeed = 10000;
let crateMillis = 0;

let allPlayerHealth = 100;
let allPlayerlives = 5;



function preload(){
  myFont = loadFont("screen image/Debrosee.ttf");

  startScreen = loadImage("screen image/Baguette start screen.png");
  campaignscreen = loadImage("screen image/campaignplan.png");
  customDemo = loadImage("screen image/custom demo screen.png");

  for (let item of campaignLevel){
    let mapy = loadJSON(item);
    campaignMapData.push(mapy);
  }
  
  // for (){

  // }
  playerImg = loadImage("character/baguette.png");
  botImg = loadImage("character/baguetteBot.png");

  doorDashCrate = loadImage("character/doordash.png");

  for (let item of weaponList){
    let weap = loadImage(item.type);
    let bullet = weap;
    if (item.bull !== item.type){
      bullet = loadImage(item.bull);
    }
    weaponData.push({type: weap, bull: bullet, name: item.name} );
  }

  // cheese = loadImage("weapon/cheese.png");
  // allWeapon.push("cheese");

  // pizza = loadImage("weapon/pizza weapon.png");
  // allWeapon.push("pizza");

  // pistol = loadImage("weapon/gun.png");
  // allWeapon.push("pistol");
  
  // gunBullet = loadImage("weapon/bullet.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth();
  makeButton();
  makeNewMap();
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
  if (gamePhrase === "Custom"){
    customScreen();
  }
  if (gamePhrase === "Dead"){
    console.log("dead");
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

  else if (gamePhrase === "Custom"){
    for (let num = 0; num < allButton.length; num ++){
      if (allButton[num].hover()){
        battleSetup(sliderButton[0].ammount, sliderButton[1].ammount,sliderButton[2].ammount, "bot");
        console.log(map);
        gamePhrase = "battle";
      }
    }
  }
}

function keyPressed(){
  if (key === "b"){
    
    resetButton();
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
    resetButton();
    if (key === "s"){
      player.moveDown();
    }
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
  }

  else if (name === "Custom"){
    gamePhrase = "Custom";
    let multiplayerButton = new CustomButton(1, "TWO PLAYERS");
    let trainingMode = new CustomButton(3, "TRAINING MODE");
    allButton = [multiplayerButton, trainingMode];

    let healthSlider = new CustomSlider("Start Health", 50,1, 1001, 10);
    let crateSlider = new CustomSlider("Crate Time", 100, 1000, 100000, 1000);
    let lifeSlider = new CustomSlider("Lives", 150, 0, 20, 1);

    sliderButton = [healthSlider, crateSlider, lifeSlider];

  }
  else if (name === "Guide"){
    gamePhrase = "Guide";
  }
  else if (name === "Zombie"){
    gamePhrase = "Zombie";
  }
  else if (name === "Map"){
    // push();
    // fill(200);
    // makeNewMap();
    // pop();
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

function battleSetup(health, crateSpeed, lives, opponent){

  player = new PlayerBaguette(health, lives);
  player.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);

  bot = new BotPlayer(health, lives);
  bot.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
  // if (opponent === "bot"){

  // }
  
  everyMovingThing.push(bot);
  everyMovingThing.push(player);

  if (health === 1001){
    allPlayerHealth = Infinity;
  }
  else{
    allPlayerHealth = health;
  }
  crateSpawnSpeed = crateSpeed;
  allPlayerlives = lives;
  crateMillis = millis();
}

function resetButton(){
  for(let slide of sliderButton){
    slide.end();
  }
  if (currentBlockColor){
    currentBlockColor.end();
  }
  
  allCampaignButton = [];
}

