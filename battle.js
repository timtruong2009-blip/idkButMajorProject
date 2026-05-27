
function fightStart(){
  // console.log(player.xVelocity);
  if (!map){
    return;
  }
  everyMovingThing = [player, bot];
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
  bot.loseMomentum();

  displayScreen();

  updateCrate();

  push();
  stroke("black");
  pop();
  // if (abosluteFreeze !== 0){
  //   player.y = abosluteFreeze;
  // }
}

//-----------------------------------------------Class--------------------------------------------------------------
// make player
class PlayerBaguette{
  constructor(){
    // this.opponent = [];
    this.direction = true;
    this.name = "player";

    this.currentWeapon = null;
    // this.bulletList = [];
    this.lives = 5;
    this.health = 100;

    this.playerXgrid = 0;
    this.playerYgrid = 0;

    this.x = 1500;
    this.y = -1500;
    this.xPosOnScreen = 0;
    this.yPosOnScreen = 0;

    this.yVelocity = 0;
    this.xVelocity = 0;

    this.jumpspeed = -20;
    this.speed = 2;
    this.maxSpeed = 10;
    this.maxFallSpeed = 10;
    this.doubleJump = false;

    this.lastTimeShot = 0;

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

  deadOrNot(){
    if (this.y > 2900 || this.health <= 0){
      
      this.yVelocity = 0;
      this.lives -= 1;
      this.health = 100;

      this.y = -1500;
      this.x = 1500;
      if (this.lives === 0){
        console.log("you lose");
      }
    }
  }

  gotHit(damage){
    this.health -= damage;
  }

  // Player y/gravity
  updatePlayer(){
    this.playerYupdate();

    this.playerXupdate();

    this.deadOrNot();
  }
  playerJump(){
    if (this.touchGround()){
      this.yVelocity += this.jumpspeed;
      this.y += this.yVelocity;
      this.doubleJump = true;
    }
    else if (this.doubleJump){
      this.doubleJumping();
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
      
      if (Array.isArray(map[this.playerYgrid +1][this.playerXgrid]) && ! Array.isArray(map[this.playerYgrid][this.playerXgrid])){
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
      this.doubleJump = true;
    }
    else{
      this.y += this.yVelocity;
      
    }
  }
  doubleJumping(){
    this.yVelocity = structuredClone(this.jumpspeed + 3);
    this.doubleJump = false;
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
    if (this.xVelocity <= 0.05 && this.xVelocity >= -0.05 ) {
      this.xVelocity = 0;
    }
  }
  searchWall(){
    if (this.playerXgrid <= 0 || this.playerXgrid >= 60 || this.playerYgrid <= 0 || this.playerYgrid >= 30){
      return;
    }
    else{
      if (Array.isArray(map[this.playerYgrid ][this.playerXgrid +1]) && ! Array.isArray(map[this.playerYgrid][this.playerXgrid])){ 
        this.rightWall = (this.playerXgrid +1) * REALGRIDSIZE;
      }
      else{
        this.rightWall = Infinity;
      }

      if (Array.isArray(map[this.playerYgrid ][this.playerXgrid -1]) && ! Array.isArray(map[this.playerYgrid][this.playerXgrid])){
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

  // Shooting
  shoot(){
    if (this.lastTimeShot + this.currentWeapon.frequency < millis()){
      let direc = 1;
      if (this.direction){
        direc = -1;
      }

      let newBullet = new Bullet(this.x + 20*direc, this.y - 40, this.currentWeapon.bullet, this.currentWeapon.range, this.currentWeapon.knockBack, this.currentWeapon.bulletSpeed * direc, this.currentWeapon.damage);
      bulletList.push(newBullet);
      this.currentWeapon.ammo -= 1;
      if (this.currentWeapon.ammo === 0){
        this.currentWeapon = new Pistol();
      }
      if (this.direction){
        this.x += 2;
      }
      else{
        this.x -= 2;
      }

      this.lastTimeShot = millis();
    }

  }


}

class BotPlayer extends PlayerBaguette{
  constructor(){
    super();
    this.name = "bot"
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
  // if (keyIsDown(87)){
  //   // player.playerJump();
  // }

  if (keyIsDown(32)){
    player.shoot();
  }
}

//------------------------------------------------ Weapon ----------------------------------------------------

class Bullet{
  constructor(x, y, type, range, knockBack, speed, damage){
    this.x = x;
    this.y = y;
    this.type = type;
    this.range = range;
    this.knockBack = knockBack;
    this.speed = speed;
    this.damage = damage;
  }
}

class Weapon{
  constructor(){
    this.name = null;
    this.bullet = null;
    this.bulletList = [];
    
    this.range = 0;
    this.knockBack = 0;
    this.frequency = 0;
    
    this.gunSpeed = 1;
    this.bulletSpeed = 10;
    this.ammo = 0;
    this.damage = 0;
  }
  displayWeapon(x,y){
    push();
    image(this.name, x, y);
    pop();
  }

}

class Pistol extends Weapon{
  constructor(){
    super();
    this.name = pistol;
    this.bullet = gunBullet;
    this.range = 1000;
    this.knockBack = 10;
    this.frequency = 700;
    this.ammo = Infinity;
    this.bulletSpeed = 15;
    this.damage = 5;
  }
}

class Pizza extends Weapon{
  constructor(){
    super();
    this.name = pizza;
    this.bullet = pizza;
    this.range = 300;
    this.knockBack = 20;
    this.frequency = 1000;
    this.ammo = 7;
    this.bulletSpeed = 40;
    this.damage = 20;
  }
}

class Cheese extends Weapon{
  constructor(){
    super();
    this.name = cheese;
    this.bullet = cheese;
    this.range = 1000;
    this.knockBack = 80;
    this.frequency = 100;
    this.ammo = 50;
    this.gunSpeed = 50;
    this.damage = 3;
  }
}

// pizza bommarang

// honey bottle genade / less friction

// fries shotgun

// banana sniper


//------------------------------------------------Map---------------------------------------------------------

function generateSurrounding() {
  player.playerXgrid = floor(player.x / REALGRIDSIZE);
  player.playerYgrid = floor(player.y / REALGRIDSIZE);

  bot.playerXgrid = floor(bot.x / REALGRIDSIZE);
  bot.playerYgrid = floor(bot.y / REALGRIDSIZE);

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
        pop();
      }
      else{
        if (map[y][x] === 0){
          push();
          fill(200);
          square(cordX, cordY, REALGRIDSIZE);
          pop();
        }
        else if (map[y][x] === 1){
          push();
          fill(205);
          square(cordX, cordY, REALGRIDSIZE);
          pop();
        }
        else if (map[y][x] === 2){
          push();
          fill(210);
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
      let BotPosX = (floor(bot.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + bot.x % REALGRIDSIZE;
      let BotPosY = (floor(bot.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + bot.y % REALGRIDSIZE;
      displayBot(BotPosX, BotPosY);

      displayCrate(x, y, cordX, cordY);
      
      // Load Bullet
      
      
    }
  }
  for (let i = bulletList.length - 1; i >= 0; i--) {
    let shot = bulletList[i];
    shot.x += shot.speed; 
    let bulletScreenX = (floor(shot.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + shot.x % REALGRIDSIZE;
    let bulletScreenY = (floor(shot.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + shot.y % REALGRIDSIZE;

    push();
    imageMode(CENTER);
    image(shot.type, bulletScreenX, bulletScreenY, 100, 50);
    pop();

    shot.range -= Math.abs(shot.speed);

    for (let thing of everyMovingThing){
      if (shot.x > thing.x - 20 && shot.x < thing.x + 20 && shot.y < thing.y && shot.y > thing.y - 50 ){
        bulletList.splice(i, 1);
        thing.xVelocity += shot.speed;
        thing.gotHit(shot.damage);
      }
    }

    if (shot.range <= 0) {
      bulletList.splice(i, 1);
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
        player.currentWeapon = new Pizza();
      }

      else if (randomWeapon === "cheese"){
        player.currentWeapon = new Cheese();
      }

      else if (randomWeapon === "cheese"){
        player.currentWeapon = new Cheese();
      }

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

function displayBot(PosX, PosY){
  push();

  let x = PosX;
  if (!bot.direction){
    scale(-1,1);
    x = -x;
  }

  imageMode(CENTER);
  image(playerImg, x, PosY -30, 75,75 );
  if (bot.currentWeapon !== null){
    bot.currentWeapon.displayWeapon(x, PosY -30);
  }
  pop();
}

// ---------------------------------------------------Health Screen ------------------------------------------------

function displayScreen(){
  let screenSection = windowWidth / everyMovingThing.length;
  for (let thing = 0; thing < everyMovingThing.length; thing ++){
    push();
    let offset = screenSection * thing;
    stroke("black");
    rect(screenSection / 3 + offset, height, screenSection / 3, -100);

    text("Lives: " + everyMovingThing[thing].lives ,screenSection / 3 + offset + 10, height - 20);
    text("Health: " + everyMovingThing[thing].health ,screenSection / 3 + offset + 10, height - 35);
    text("Ammo Left: " + everyMovingThing[thing].currentWeapon.ammo ,screenSection / 3 + offset + 10, height - 50);

    textSize(30);
    textAlign(CENTER);
    text(everyMovingThing[thing].name ,screenSection / 3 + offset + (screenSection / 6), height - 75);

    pop();
  }
}








