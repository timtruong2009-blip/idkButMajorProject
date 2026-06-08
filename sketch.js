// Baguette Mayhem
// Tim Truong
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// All the brainstorm screen/font for design
let startScreen;
let campaignscreen;
let guideScreen;
let customDemo;
let zombieScreenImg;
let winScreen;
let defeatScreen;

let myFont;

// diffrent kind of button
let gamePhrase  = "start";
let allButton = [];
let sliderButton = [];
let allCampaignButton = [];

let currentBlockColor;

let buttonName = ["Campaign", "Custom","Guide", "Zombie", "Map"];

// for loading map auto just put the path into the list
let campaignLevel = ["map_list/examplemap.json", "map_list/jungle map.json", "map_list/goodmap.json", "map_list/leo's cat.json", "map_list/kevin.json"];
let campaignMapData = [];

// for loading weapon auto put weapon into list
let weaponList = [{type: "weapon/cheese.png", bull : "weapon/cheese.png", name: "cheese"},
  {type: "weapon/pizza weapon.png", bull : "weapon/pizza weapon.png", name: "pizza"},
  {type: "weapon/gun.png", bull : "weapon/bullet.png", name: "pistol"},
  {type: "weapon/banana.png", bull : "weapon/bananaBullet.png", name: "banana"}
];
let weaponData = [];

// map measurement/setting
let map = [];
const GRIDSIZE = 32; // only in the MAP function
const MAPHEIGHT = 30;
const MAPWIDTH = 60;

const REALGRIDSIZE = 50; // for battle

let deathY = 3000; // height when you die

const GRAVITY = 1;

// entity
let player;
let player2;

let playerImg;
let duckImg;

let botImg;

// things to keep track of
let everyMovingThing = [];
let everyBots = [];
let bulletList = [];
let everyCrate = [];
let everyDamageParticle = [];

// crate stats
let doorDashCrate;
let abosluteFreeze = 0;
let crateSpawnSpeed = 10000;
let crateMillis = 0;

// player stats
let allPlayerHealth = 100;
let allPlayerlives = 5;

// duck stats
let everyDuck = [];
let duckSpawnRate = 5000;
let duckLastSpawn = 0;
let duckMap;


function preload(){
  // cool font found
  myFont = loadFont("screen image/Debrosee.ttf");

  // load screen so that it looks cool
  startScreen = loadImage("screen image/mainscreen.png");
  campaignscreen = loadImage("screen image/campaignscreen.png");
  customDemo = loadImage("screen image/customscreen.png");
  guideScreen = loadImage("screen image/guide.png");
  zombieScreenImg = loadImage("screen image/zombiescreen.png");
  winScreen = loadImage("screen image/winscreen.png");
  defeatScreen = loadImage("screen image/leo's defeat screen.png");


  // load all available maps
  for (let item of campaignLevel){
    let mapy = loadJSON(item);
    campaignMapData.push(mapy);
  }
  
  // exclusive map for zombie
  duckMap = loadJSON("map_list/duckmap.json");

  // entity image
  playerImg = loadImage("character/baguette.png");
  botImg = loadImage("character/baguetteBot.png");
  duckImg = loadImage("character/duck.png");

  // crate image
  doorDashCrate = loadImage("character/doordash.png");

  //loading all weapons
  for (let item of weaponList){
    let weap = loadImage(item.type);
    let bullet = weap;
    if (item.bull !== item.type){
      bullet = loadImage(item.bull);
    }
    weaponData.push({type: weap, bull: bullet, name: item.name} );
  }
}

// basic setup for game
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noSmooth();
  makeButton();
  makeNewMap();
}

// activate all the main function
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
    fightStart("bot");
  }
  if (gamePhrase === "battleDuck"){
    fightStart("duck");
  }
  if (gamePhrase === "Guide"){
    displayGuide();
  }
  if (gamePhrase === "Custom"){
    customScreen();
  }
  if (gamePhrase === "Zombie"){
    zombieScreen();
  }
  if (gamePhrase === "win"){
    image(winScreen, 0, 0, width, height);
  }
  if (gamePhrase === "lose"){
    image(defeatScreen, 0, 0, width, height);
  }
}

// mouse press, mostly for pressing buttons
function mousePressed(){
  if (gamePhrase === "start"){
    for (let button of allButton){
      if (button.hover()){
        switchPhrase(button.word);;
      }
    }
  }
  //to detect which level was picked
  else if (gamePhrase === "Campaign"){
    for (let num = 0; num < allCampaignButton.length; num ++){
      if (allCampaignButton[num].hover()){
        loadMap(campaignLevel[num]);
      }
    }
  }
  // to detect which gamemode is click
  else if (gamePhrase === "Custom"){
    for (let num = 0; num < allButton.length; num ++){
      if (allButton[num].hover()){
        battleSetup(sliderButton[0].ammount, sliderButton[1].ammount,sliderButton[2].ammount, sliderButton[3].ammount);
        gamePhrase = "battle";
      }
    }
  }
}

// key pressed for player battle or color wheel
function keyPressed(){
  if (key === "b"){
    switchPhrase("start");
  }
  if (gamePhrase === "Zombie"){
    gamemodeZombie();
  }
  if (gamePhrase === "battle" || gamePhrase === "battleDuck" ){
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
    // to see what square of the map was pressed
    if (key === "e"){
      mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};
      map[mouse_press_pos.y][mouse_press_pos.x] = 0;
    }
    if (key === "o"){
      makeNewMap();
    }
  }
}

// when switching to other phrase do basic setup
function switchPhrase(name){
  // if campaign then load level
  if (name === "Campaign"){
    gamePhrase = "Campaign";
    loadingGameMap();
    for (let level = 1; level <= campaignLevel.length; level ++){
      loadLevelText(level);
    }
  }
  // if battle then just battle ig
  else if (name === "battle"){
    gamePhrase = "battle";
  }

  // if custom then setup all the button and slider
  else if (name === "Custom"){
    gamePhrase = "Custom";
    let multiplayerButton = new CustomButton(1, "NONE RIGHT NOW");
    let trainingMode = new CustomButton(3, "TRAINING MODE");
    allButton = [multiplayerButton, trainingMode];

    let healthSlider = new CustomSlider("Start Health", 50,1, 1001, 10);
    let crateSlider = new CustomSlider("Crate Time", 100, 1000, 100000, 1000);
    let lifeSlider = new CustomSlider("Lives", 150, 0, 20, 1);
    let botSlider = new CustomSlider("num of bot", 200,1, 5, 1);
    sliderButton = [healthSlider, crateSlider, lifeSlider, botSlider];
  }

  else if (name === "Guide"){
    gamePhrase = "Guide";

  }

  else if (name === "Zombie"){
    gamePhrase = "Zombie";

  }

  else if (name === "start"){
    gamePhrase = "start";
    resetButton();

  }
  // load color wheel
  else if (name === "Map"){
    gamePhrase = "Map";
    currentBlockColor = new CurrentBlockColor();
  }
}

// making a brand new blank map
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

// when you battle, setup all the basic stuff as well as reset sum stuff
function battleSetup(health, crateSpeed, lives, opponent){
  everyMovingThing = [];
  everyDuck = [];
  everyBots = [];

  player = new PlayerBaguette(health, lives);
  player.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
  everyMovingThing.push(player);

  for (let i = 0; i < opponent; i ++){
    let bots = new BotPlayer(health, lives, botImg);
    bots.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
    everyBots.push(bots);
    everyMovingThing.push(bots);
  }

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

// if b is pressed then reset the whole stuff
function resetButton(){
  for(let slide of sliderButton){
    slide.end();
  }
  if (currentBlockColor){
    currentBlockColor.end();
  }
  allCampaignButton = [];
  makeButton();
}

