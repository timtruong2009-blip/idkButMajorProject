
function fightStart(){
  
  if (!map){
    return;
  }
  push();
  generateSurrounding();
  pop();
  spawningCrate();

  playerMoving();
  player.searchPlatform();
  player.updatePlayer();
  player.loadPlayer();
  
  bot.searchPlatform();
  bot.updatePlayer();
  bot.loadPlayer();

  updateCrate();

  push();
  stroke("black");
  pop();
  if (abosluteFreeze !== 0){
    player.y = abosluteFreeze;
  }
}

//-----------------------------------------------Class--------------------------------------------------------------
// make player
class PlayerBaguette{
  constructor(){
    // this.opponent = [];
    this.direction = true;

    this.currentWeapon = new Pistol();

    this.playerXgrid = 0;
    this.playerYgrid = 0;

    this.x = 1500;
    this.y = -2000;
    this.xPosOnScreen = 0;
    this.yPosOnScreen = 0;

    this.yVelocity = 0;
    this.xVelocity = 0;

    this.jumpspeed = -20;
    this.speed = 2;
    this.maxSpeed = 10;
    this.maxFallSpeed = 20;

    this.friction = 5;
    
    this.platformY = Infinity;
    this.rightWall = Infinity;
    this.leftWall = -Infinity;
  }
  loadPlayer(){
    push();
    let x = this.xPosOnScreen;
    if (!this.direction){
      scale(-1,1);
      x = -x;
    }

    imageMode(CENTER);
    image(playerImg, x, this.yPosOnScreen -30, 75,75 );
    if (this.currentWeapon !== null){
      this.currentWeapon.displayWeapon(x, this.yPosOnScreen -30);
    }
    pop();
  }

  // Player y/gravity
  updatePlayer(){
    this.playerYupdate();

    this.playerXupdate();
  }
  playerJump(){
    if (this.touchGround()){
      this.yVelocity += this.jumpspeed;
      this.y += this.yVelocity;
    }
  }
  searchPlatform(){
    if (this.playerXgrid <= 0 || this.playerXgrid >= 60 || this.playerYgrid <= 0 || this.playerYgrid >= 30){
      return;
    }
    if (this.yVelocity >= 0){
      if (!this.touchGround()){
        this.platformY = structuredClone(deathY);
      }
      
      if (map[this.playerYgrid +1][this.playerXgrid] !== 0  && map[this.playerYgrid][this.playerXgrid] === 0){
        this.platformY = (this.playerYgrid +1 ) * REALGRIDSIZE;
      }
      else{
        this.platformY = structuredClone(deathY);
      }
    }
  }
  touchGround(){
    if (this.y <= this.platformY -2){
      return false;
    }
    else{
      this.yVelocity = 0;
      return true;
    }
  }
  playerYupdate(){
    this.yVelocity += GRAVITY;
    if (this.yVelocity >= this.maxFallSpeed){
      this.yVelocity = structuredClone(this.maxFallSpeed);
    }
    if (this.y + this.yVelocity >= this.platformY ){
      this.y = this.platformY -1;
      this.yVelocity = 0;
    }
    else{
      this.y += this.yVelocity;
      
    }
  }

  // Player x/friction/ wall collision
  moveDown(){
    if (this.touchGround()){
      this.y += 5;
    }
  }
  playerMove(direction){
    if (this.xVelocity + this.speed * direction > this.maxSpeed || this.xVelocity + this.speed * direction < -this.maxSpeed){
    }
    else{
      
      let stuffToAddToVelocity= 0.2 * direction * this.speed;
      this.xVelocity += stuffToAddToVelocity ;
    }
  }
  loseMomentum(){
    if (this.xVelocity < 0){
      this.xVelocity += this.speed / this.friction;
    }
    else if (this.xVelocity > 0){
      this.xVelocity -= this.speed /this.friction;
    }
    if (this.xVelocity < 0.05 && this.xVelocity > -0.05 ) {
      this.xVelocity = 0;
    }
  }
  searchWall(){
    if (this.playerXgrid <= 0 || this.playerXgrid >= 60 || this.playerYgrid <= 0 || this.playerYgrid >= 30){
      return;
    }
    else{
      if (map[this.playerYgrid][this.playerXgrid +1] !== 0 && map[this.playerYgrid][this.playerXgrid] === 0){ 
        this.rightWall = (this.playerXgrid +1) * REALGRIDSIZE;
      }
      else{
        this.rightWall = Infinity;
      }

      if (map[this.playerYgrid][this.playerXgrid -1] !== 0 && map[this.playerYgrid][this.playerXgrid] === 0){
        this.leftWall = this.playerXgrid * REALGRIDSIZE;
      }
      else{
        
        this.leftWall = -Infinity;
      }
    }
    
  }
  playerXupdate(){
    this.searchWall();
    if (this.x + this.xVelocity < this.leftWall){
      this.x = this.leftWall + 0.01;
      this.xVelocity = 0;
    }
    else if (this.x + this.xVelocity > this.rightWall){
      this.x = this.rightWall - 0.01;
      this.xVelocity = 0;
    }
    else{
      this.x += this.xVelocity;
    }
  }
}

class BotPlayer extends PlayerBaguette{
  constructor(){
    super();
  }
  loadPlayer(){
    push();
    imageMode(CENTER);
    image(playerImg, this.x, this.y -30, 75,75 );
    pop();
  }
}

class Weapon{
  constructor(){
    this.name = null;
    this.bulletList = [];
    this.range = 0;
    this.knockBack = 0;
    this.frequency = 0;
    this.lastTimeShot = 0;
  }
  displayWeapon(x,y){
    push();
    image(this.name, x, y);
    pop();
  }
  shoot(){
    if (this.lastTimeShot + this.frequency < millis()){
    console.log("ya");
    this.lastTimeShot = millis();
    }
  }
}

class Crate extends PlayerBaguette{
  constructor(x){
    super();
    this.x = x;
    this.maxFallSpeed = 10;
  }

}

function playerMoving(){
  if (keyIsDown(65)){
    player.playerMove(-1);
    player.direction = true;
  }
  else if (keyIsDown(68)){
    player.playerMove(1);
    player.direction = false;
  }
  else{
    player.loseMomentum();
  }
  if (keyIsDown(87)){
    player.playerJump();
  }
  if (keyIsDown(87)){
    player.playerJump();
  }

  if (keyIsDown(32)){
    player.currentWeapon.shoot();
  }
}

//------------------------------------------------Map---------------------------------------------------------

function generateSurrounding() {
  player.playerXgrid = floor(player.x / REALGRIDSIZE);
  player.playerYgrid = floor(player.y / REALGRIDSIZE);

  let whereInGridx = player.x - player.playerXgrid * REALGRIDSIZE;
  let whereInGridy = player.y - player.playerYgrid * REALGRIDSIZE;

  let gridOnScreenH = Math.ceil(windowHeight / REALGRIDSIZE) ;
  let gridOnScreenW = Math.ceil(windowWidth / REALGRIDSIZE) ;

  let smallestX = player.playerXgrid - Math.floor(gridOnScreenW/2);
  let smallestY = player.playerYgrid - Math.floor(gridOnScreenH/2);

  let biggestX = player.playerXgrid + Math.ceil(gridOnScreenW/2) +1;
  let biggestY = player.playerYgrid + Math.ceil(gridOnScreenH/2) +2;

  for (let y = smallestY; y < biggestY; y ++){
    for (let x = smallestX; x < biggestX; x ++){
      let cordX = (x - smallestX) * REALGRIDSIZE - whereInGridx;
      let cordY = (y - smallestY) * REALGRIDSIZE - whereInGridy;
      
      if (x < 0 || x > 60 || y < 0 || y > 30){
        fill(200);
        square(cordX, cordY, REALGRIDSIZE);
      }

      else if (x === player.playerXgrid && y === player.playerYgrid){
        push();
        fill("pink");
        square(cordX, cordY, REALGRIDSIZE);
        fill("red");
        circle(cordX + whereInGridx, cordY + whereInGridy,10);
                                                    
        player.xPosOnScreen = cordX + whereInGridx;
        player.yPosOnScreen = cordY + whereInGridy;

        // player.xPosOnScreen = cordX + whereInGridx;
        // player.yPosOnScreen = cordY + whereInGridy;
        pop();
      }
      else{
        if (map[y][x] === 0){
          push();
          fill(200);
          square(cordX, cordY, REALGRIDSIZE);
          pop();
        }
        else {
          push();
          fill(color(map[y][x][0], map[y][x][1], map[y][x][2]));
          square(cordX, cordY, REALGRIDSIZE);
          pop();
        }
      }

      displayBot(x, y, cordX, cordY);

      displayCrate(x, y, cordX, cordY);
      

    }
  }
  
}

//------------------------------------------------Crate---------------------------------------------------------------

function spawningCrate(){
  if (crateMillis + crateSpawnSpeed < millis()){
    let xSpawn = floor(random(60));
    let newCrate = new Crate(xSpawn * REALGRIDSIZE);
    everyCrate.push(newCrate);
    crateMillis = millis();
  }
}

function updateCrate(){
  for (let item of everyCrate){
    item.searchPlatform();
    item.updatePlayer();

    if (item.playerXgrid === player.playerXgrid && item.playerYgrid === player.playerYgrid){
      let randomWeapon = allWeapon[floor(random(allWeapon.length))];

      if (randomWeapon === "pistol"){
        player.currentWeapon = new Pistol();
      }

      else if (randomWeapon === "pizza"){
        player.currentWeapon = new Pizza;
      }

      else if (randomWeapon === "cheese"){
        player.currentWeapon = new Cheese();
      }

      else if (randomWeapon === "cheese"){
        player.currentWeapon = new Cheese();
      }

      console.log(randomWeapon);
      everyCrate.splice(everyCrate.indexOf(item), 1);
      
    }
  }
}

function displayCrate(x, y, cordX, cordY){
  for (let item of everyCrate){
    item.playerXgrid =  floor(item.x / REALGRIDSIZE);
    item.playerYgrid = floor(item.y / REALGRIDSIZE);
    if (x === item.playerXgrid && y === item.playerYgrid){
      push();
      fill("blue");
      square(cordX, cordY, REALGRIDSIZE);
      
      // circle(cordX + whereInGridx, cordY + whereInGridy,10);
                                                  
      // player.xPosOnScreen = cordX + whereInGridx;
      // player.yPosOnScreen = cordY + whereInGridy;
      pop();
    }
  }
}

//----------------------------------------------------- Bot ------------------------------------------------------

function displayBot(x, y, cordX, cordY){
  bot.playerXgrid = floor(bot.x / REALGRIDSIZE);
  bot.playerYgrid = floor(bot.y / REALGRIDSIZE);

  if (x === bot.playerXgrid && y === bot.playerYgrid){
    push();
    fill("red");
    square(cordX, cordY, REALGRIDSIZE);
    pop();
  }
}

//----------------------------------------------------- Gun ---------------------------------------------------------

class Pistol extends Weapon{
  constructor(){
    super();
    this.name = pistol;
    this.range = 1000;
    this.knockBack = 10;
    this.frequency = 700;
  }
}

class Pizza extends Weapon{
  constructor(){
    super();
    this.name = pizza;
    this.range = 1000;
    this.knockBack = 20;
    this.frequency = 1000;
  }
}

class Cheese extends Weapon{
  constructor(){
    super();
    this.name = cheese;
    this.range = 1000;
    this.knockBack = 80;
    this.frequency = 100;
  }
}

// pizza bommarang

// honey bottle genade / less friction

// fries shotgun

// 






