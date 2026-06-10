
function fightStart(who){
  if (!map){
    return;
  }
  push();
  generateSurrounding();
  pop();

  spawningCrate();

  // if the gamemode selected is duck mode then it spawn duck without weapon
  if (who === "duck"){
    if (duckLastSpawn + duckSpawnRate < millis()){
      let newDuck = new BotPlayer(20, 1, duckImg);
      newDuck.currentWeapon = new Explosion();
      newDuck.maxSpeed = 5;
      everyMovingThing.push(newDuck);
      everyBots.push(newDuck);
      duckLastSpawn = millis();
      duckSpawnRate -= 10;
    }
  }
  // loading player and everything
  playerMoving();
  player.searchPlatform();
  player.updatePlayer();
  player.loadPlayer();
  if (player.deadOrNot()){
    gamePhrase = "lose";
  }
  
  // loading all the bots
  for (let bots of everyBots){
    console.log(bots.stateY);
    bots.searchPlatform();
    bots.updatePlayer();
    bots.botAiManager(who);
    if (bots.deadOrNot()){
      everyBots.splice(everyBots.indexOf(bots, 1));
    }
  }
  
  // displaying ui and health and stuff
  displayScreen(who);

  updateCrate(who);

  // if duck touch player player DIE
  duckSkillOnly(who);

  // detect if no bot you win
  if (everyBots.length === 0 && who !== "duck"){
    gamePhrase = "win";
  }
}

//-----------------------------------------------Class--------------------------------------------------------------
// make player
class PlayerBaguette{
  constructor(health, lives){
    // this.opponent = [];
    this.direction = true;
    this.name = "player";
    this.imageUsed = playerImg;

    this.currentWeapon = null;
    // this.bulletList = [];
    if (lives === 20){
      this.lives = Infinity;
    }
    else{
      this.lives = lives;
    }

    if (health === 1001){
      this.health = Infinity;
    }
    else{
      this.health = health;
    }

    // the grid on map player is on (for easier time calculating)
    this.playerXgrid = 0;
    this.playerYgrid = 0;

    // x and y value
    this.x = 1500;
    this.y = -1500;
    this.xPosOnScreen = width /2;
    this.yPosOnScreen = height /2;

    // x and y velo
    this.yVelocity = 0;
    this.xVelocity = 0;

    // player stats and stuff
    this.jumpspeed = -20;
    this.speed = 2;
    this.maxSpeed = 10;
    this.maxFallSpeed = 15;
    this.doubleJump = false;

    this.gettingKnockBack = false;

    this.lastTimeShot = 0;

    this.friction = 5;
    
    this.platformY = Infinity;
    this.rightWall = Infinity;
    this.leftWall = -Infinity;
  }
  //---------------------------------------------General
  // load player and weapon on the screen
  loadPlayer(){
    push();
    let x = this.xPosOnScreen;
    if (!this.direction){
      scale(-1,1);
      x = -x;
    }
    imageMode(CENTER);
    if (this.yPosOnScreen !== 0){
      image(this.imageUsed, x, this.yPosOnScreen -30, 75,75 );
      if (this.currentWeapon !== null){
        this.currentWeapon.displayWeapon(x, this.yPosOnScreen -30);
      }
    }
    pop();
  }

  // check if player fall out of bound or not
  deadOrNot(){
    if (this.y > 2900 || this.health <= 0 || Math.abs(this.x) > 4000){
      
      this.yVelocity = 0;
      this.xVelocity = 0;

      if ( this.lives !== Infinity){
        this.lives -= 1;
        // console.log(player.lives);
      }
      else{
        // console.log("XD");
      }
      
      this.health = structuredClone(allPlayerHealth);

      this.y = -1500;
      this.x = 1500;
      this.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
      if (this.lives < 0){
        return "end";
      }
      return false;
    }
  }

  // if got hit delete health
  gotHit(damage){
    this.health -= damage;
  }

  // updating player x and y velocity
  updatePlayer(){
    this.playerYupdate();

    this.playerXupdate();
  }

  //---------------------------------------------Y section/jumping/gravity
  // if w press call to jump
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
  // if on air then double jump
  doubleJumping(){
    this.yVelocity = structuredClone(this.jumpspeed + 3);
    this.doubleJump = false;
  }
  // search if there is platform under to stand on
  searchPlatform(){
    
    if (this.playerXgrid <= 0 || this.playerXgrid >= 60 || this.playerYgrid <= 0 || this.playerYgrid >= 30){
      this.platformY = structuredClone(deathY);
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
  // search if player is currently standing on ground or not
  touchGround(){
    if (this.y <= this.platformY -2){
      return false;
    }
    else{
      this.yVelocity = 0;
      return true;
    }
  }
  // updating player y 
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

  //-------------------------------------------- X Section/friction/ wall collision

  moveDown(){
    if (this.touchGround()){
      this.y += 5;
    }
  }
  playerMove(direction){
    // console.log(this.xVelocity);
    if (this.gettingKnockBack && Math.abs(this.xVelocity )> this.maxSpeed){
      let futureSpeed = this.xVelocity + direction /2;
      if (Math.abs(futureSpeed ) > Math.abs(this.xVelocity )){
        this.loseMomentum();
      }
      else {
        this.xVelocity += direction /2;
      }
    }
    else{
      if (this.xVelocity + this.speed * direction > this.maxSpeed || this.xVelocity + this.speed * direction < -this.maxSpeed){
      }
      else{
        
        let stuffToAddToVelocity= 0.2 * direction * this.speed;
        this.xVelocity += stuffToAddToVelocity ;
      }
    }
    
  }
  loseMomentum(){
    if (this.gettingKnockBack){
      this.xVelocity *= 0.97;
      if (Math.abs(this.xVelocity) <= this.maxSpeed){
        this.gettingKnockBack = false;
      }
    }
    else{
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

    if (Math.abs(this.yVelocity) > 30){
      this.yVelocity = 20;

    }
  }

  // ---------------------------------------------Shooting
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
        this.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
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

// crate/ for same grav as player
class Crate extends PlayerBaguette{
  constructor(x){
    super();
    this.x = x;
    this.maxFallSpeed = 10;
  }
}

// player key press to move
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
// if duck touch it kill you
function duckSkillOnly(who){
  if (who !== "duck"){
    return;
  }
  for (let duck of everyBots){
    if (duck.playerXgrid === player.playerXgrid && duck.playerYgrid === player.playerYgrid){
      player.gotHit(duck.currentWeapon.damage);
      everyBots.splice(everyBots.indexOf(duck), 1);
    }
  }
}

// base for all bullet
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

// base for all weapons
class Weapon{
  constructor(img, bullet){
    this.name = img;
    this.bullet = bullet;
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
    if (this.name !== null){
      push();
      image(this.name, x, y);
      pop();
    }
  }
}
//-----------------------------------------------All custom weapon
class Pistol extends Weapon{
  constructor(img, bullet){
    super(img, bullet);
    this.range = 1000;
    this.knockBack = 20;
    this.frequency = 400;
    this.ammo = Infinity;
    this.bulletSpeed = 15;
    this.damage = 5;
  }
}

class Pizza extends Weapon{
  constructor(img, bullet){
    super(img, bullet);
    this.range = 300;
    this.knockBack = 40;
    this.frequency = 400;
    this.ammo = 7;
    this.bulletSpeed = 40;
    this.damage = 20;
  }
}

class Cheese extends Weapon{
  constructor(img, bullet){
    super(img, bullet);
    this.range = 1000;
    this.knockBack = 15;
    this.frequency = 100;
    this.ammo = 50;
    this.bulletSpeed = 25;
    this.damage = 3;
  }
}

class Banana extends Weapon{
  constructor(img, bullet){
    super(img, bullet);
    this.range = 1000;
    this.knockBack = 35;
    this.frequency = 1500;
    this.ammo = 10;
    this.bulletSpeed = 20;
    this.damage = 25;
  }
}

// duck explosion
class Explosion extends Weapon{
  constructor(){
    super(null, null);
    this.range = 0;
    this.knockBack = 0;
    this.frequency = 0;
    this.ammo = 0;
    this.bulletSpeed = 0;
    this.damage = 100;
  }
}
// pizza bommarang (nah)

// honey bottle genade / less friction

// fries shotgun

// banana sniper (done)


//------------------------------------------------Map---------------------------------------------------------
// generating the map
function generateSurrounding() {
  // give player what grid they on
  player.playerXgrid = floor(player.x / REALGRIDSIZE);
  player.playerYgrid = floor(player.y / REALGRIDSIZE);

  // give not what grid they on
  for (let bots of everyBots){
    bots.playerXgrid = floor(bots.x / REALGRIDSIZE);
    bots.playerYgrid = floor(bots.y / REALGRIDSIZE);
  }

  // where in the grid are they on
  let whereInGridx = player.x - player.playerXgrid * REALGRIDSIZE;
  let whereInGridy = player.y - player.playerYgrid * REALGRIDSIZE;
  
  // every grid that we can see on screen
  let gridOnScreenH = Math.ceil(windowHeight / REALGRIDSIZE) ;
  let gridOnScreenW = Math.ceil(windowWidth / REALGRIDSIZE) ;
  
  // smallest view that we can see
  let smallestX = player.playerXgrid - Math.floor(gridOnScreenW/2);
  let smallestY = player.playerYgrid - Math.floor(gridOnScreenH/2);

  // biggest grid that we can see
  let biggestX = player.playerXgrid + Math.ceil(gridOnScreenW/2) +1;
  let biggestY = player.playerYgrid + Math.ceil(gridOnScreenH/2) +2;

  //-------------------------------------display map
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
    }
  }

  // ------------------------------------display bot
  for (let bots of everyBots){
    let BotPosX = (floor(bots.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + bots.x % REALGRIDSIZE;
    let BotPosY = (floor(bots.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + bots.y % REALGRIDSIZE;
    push();

    let x = BotPosX;
    if (!bots.direction){
      scale(-1,1);
      x = -x;
    }

    imageMode(CENTER);
    image(bots.imageUsed, x, BotPosY -30, 75,75 );
    if (bots.currentWeapon !== null){
      bots.currentWeapon.displayWeapon(x, BotPosY -30);
    }
    pop();
  }

  //---------------------------------display damage particle;
  for (let i = everyDamageParticle.length - 1; i >= 0; i--) {
    let parti = everyDamageParticle[i];

    let partiX = (floor(parti.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + parti.x % REALGRIDSIZE;
    let partiY = (floor(parti.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + parti.y % REALGRIDSIZE;
    if ( parti.display(partiX, partiY) === "end"){
      everyDamageParticle.splice(i, 1);
    }
  }

  // --------------------------------displaying crate on map
  for (let i = everyCrate.length - 1; i >= 0; i--) {
    let item = everyCrate[i];
    item.playerXgrid = floor(item.x / REALGRIDSIZE);
    item.playerYgrid = floor(item.y / REALGRIDSIZE);

    let CratePosX = (floor(item.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + item.x % REALGRIDSIZE;
    let CratePosY = (floor(item.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + item.y % REALGRIDSIZE;
    displayCrate(CratePosX, CratePosY);
  }

  // ---------------------------------bullet update / load
  for (let i = bulletList.length - 1; i >= 0; i--) {
    let shot = bulletList[i];
    let bulletScreenX = (floor(shot.x / REALGRIDSIZE) - smallestX) * REALGRIDSIZE - whereInGridx + shot.x % REALGRIDSIZE;
    let bulletScreenY = (floor(shot.y / REALGRIDSIZE) - smallestY) * REALGRIDSIZE - whereInGridy + shot.y % REALGRIDSIZE;
    displayBullet(bulletScreenX, bulletScreenY, shot.type, shot.speed);

    shot.x += shot.speed; 
    shot.range -= Math.abs(shot.speed);

    for (let thing of everyMovingThing){
      if (shot.x > thing.x - 25 && shot.x < thing.x + 25 && shot.y < thing.y + 20 && shot.y > thing.y - 80 ){
        bulletList.splice(i, 1);
        thing.xVelocity += shot.knockBack * (shot.speed / Math.abs(shot.speed));
        thing.gotHit(shot.damage);
        thing.gettingKnockBack = true;

        let newParti = new DamageIndicator(thing.x, thing.y - 30, shot.damage);
        everyDamageParticle.push(newParti);
      }
    }
    if (shot.range <= 0) {
      bulletList.splice(i, 1);
    }
  }
  
}

//------------------------------------------------Crate---------------------------------------------------------------

// calculating the time to spawn crate 
function spawningCrate(){
  if (crateMillis + crateSpawnSpeed < millis()){
    // console.log("create");
    let xSpawn = floor(random(60));
    let newCrate = new Crate(xSpawn * REALGRIDSIZE);
    everyCrate.push(newCrate);
    crateMillis = millis();
  }
}

// updating crate/sense it someone pick it up
function updateCrate(who){
  for (let item of everyCrate){
    item.searchPlatform();
    item.updatePlayer();
    if (who !== "duck"){
      for (let people of everyMovingThing){
        if (item.playerXgrid === people.playerXgrid && item.playerYgrid === people.playerYgrid){
          let randomWeapon = weaponData[floor(random(weaponData.length))];
    
          if (randomWeapon.name === "pistol"){
            people.currentWeapon = new Banana(weaponData[1].type, weaponData[1].bull);
          }
    
          else if (randomWeapon.name === "pizza"){
            people.currentWeapon = new Pizza(randomWeapon.type, randomWeapon.bull);
          }
    
          else if (randomWeapon.name === "cheese"){
            people.currentWeapon = new Cheese(randomWeapon.type, randomWeapon.bull);
          }
    
          else if (randomWeapon.name === "banana"){
            people.currentWeapon = new Banana(randomWeapon.type, randomWeapon.bull);
          }
    
          everyCrate.splice(everyCrate.indexOf(item), 1);
          
        }
        else if(item.playerYgrid * REALGRIDSIZE > 2500){
          everyCrate.splice(everyCrate.indexOf(item), 1);
        }
      }
    }
    else{
      if (item.playerXgrid === player.playerXgrid && item.playerYgrid === player.playerYgrid){
        let randomWeapon = weaponData[floor(random(weaponData.length))];
  
        if (randomWeapon.name === "pistol"){
          player.currentWeapon = new Banana(weaponData[3].type, weaponData[3].bull);
        }
  
        else if (randomWeapon.name === "pizza"){
          player.currentWeapon = new Pizza(randomWeapon.type, randomWeapon.bull);
        }
  
        else if (randomWeapon.name === "cheese"){
          player.currentWeapon = new Cheese(randomWeapon.type, randomWeapon.bull);
        }
  
        else if (randomWeapon.name === "banana"){
          player.currentWeapon = new Banana(randomWeapon.type, randomWeapon.bull);
        }
  
        everyCrate.splice(everyCrate.indexOf(item), 1);
        
      }
      else if(item.playerYgrid * REALGRIDSIZE > 2500){
        everyCrate.splice(everyCrate.indexOf(item), 1);
      }
    }
  }
}

// displaying the crate onto the screen
function displayCrate(CratePosX, CratePosY){
  push();
  imageMode(CENTER);
  image(doorDashCrate, CratePosX + 20 , CratePosY - 5, 50, 50);
  // circle(CratePosX, CratePosY, 20);
  pop();
}

//----------------------------------------------------- Bot ------------------------------------------------------

// bot and their ai
class BotPlayer extends PlayerBaguette{
  constructor(health, lives, whatimg){
    super(health, lives);
    this.imageUsed = whatimg;
    this.name = "bot";
    this.stateX = "idle";
    this.stateY = "idle";
    this.lastJump = 0;
    this.timeToJump = 200;

    this.checkYtime = 1000;
    this.lastYCheck = 0;
    // this.whatActionNext = [];
  }

  // ai brain, decide what to do from its state
  botAiManager(who){
    if (this.playerXgrid <= 0 || this.playerXgrid >= 60 || this.playerYgrid <= 0 || this.playerYgrid >= 30){
      this.loseMomentum();
      this.y += 20;
      return;
    }
    this.daBotbrain();
    // brain for x movement
    if (this.stateX === "idle"){
      this.idle();
    }
    else if (this.stateX === "right"){
      this.playerMove(1);
      this.direction = false;
    }
    else if (this.stateX === "left"){
      this.playerMove(-1);
      this.direction = true;
    }
    else{
      this.loseMomentum();
    }
    
    if (this.stateY === "up"){
      if (this.lastJump + this.timeToJump < millis()){
        this.playerJump();
        this.lastJump = millis();
      }
    }
    else if (this.stateY === "down"){
      this.moveDown();
    }
    else{
    }



    if (who !== "duck" && Math.abs(this.x - player.x) < this.currentWeapon.range){
      this.shoot();
    }
    

  }

  // decide what state it should be in
  daBotbrain(){
    let XdistanceFromPLayer = this.x - player.x;
    let YdistanceFromPLayer = this.y - player.y;

    // console.log(YdistanceFromPLayer);
    if (XdistanceFromPLayer < 0){
      this.stateX = "right";
    }
    else if (XdistanceFromPLayer > 0){
      this.stateX =  "left";
    }
    else{
      this.stateX =  "idle";
    }

    if (YdistanceFromPLayer > 0){
      this.stateY = "up";
    }
    else if (YdistanceFromPLayer < 0 ){
      if (this.lastYCheck + this.checkYtime < millis()){
        this.stateY =  "down";
        this.lastYCheck = millis();
      }
      
    }
    else{
      this.stateY =  "idle";
    }

    
    if (player.playerYgrid < 0){
      return;
    }
    let numOfYGridUnderPlayer = MAPHEIGHT - player.playerYgrid;
    let fallingPlayer = true;
    for (let i = 0; i < numOfYGridUnderPlayer; i++){
      if (Array.isArray(map[player.playerYgrid + i][player.playerXgrid])){
        fallingPlayer = false;
      }
    }
    // console.log(fallingPlayer);
    if (fallingPlayer){
      this.stateY = "idle";
      this.stateX = "idle";
    }

    let aboutToFall = true;
    for (let i = 1; i < numOfYGridUnderPlayer; i++){
      if (Array.isArray(map[player.playerYgrid + i][player.playerXgrid])){
        aboutToFall = false;
      }
    }
    // console.log(fallingPlayer);
    if (aboutToFall && this.stateY === "down"){
      this.stateY = "idle";
    }

  }

  // idling
  idle(){
    if (this.xVelocity > 0){
      this.playerMove(-1);
    }
    else if (this.xVelocity < 0){
      this.playerMove(1);
    }
  }  
}

// ---------------------------------------------------Health Screen ------------------------------------------------

// this is use to display the player health/lives/ammos as well as the bots
function displayScreen(who){
  // only when in zombie gamemode
  if (who === "duck"){
    let screenSection = windowWidth /3;
    push();
    let offset = screenSection;
    stroke("black");
    rect(screenSection / 3 + offset, height, screenSection / 3, -100);

    textSize(30);
    text("Lives: " + player.lives ,screenSection / 3 + offset + 10, height - 20);
    text("Health: " + player.health ,screenSection / 3 + offset + 10, height - 35);
    text("Ammo Left: " + player.currentWeapon.ammo ,screenSection / 3 + offset + 10, height - 50);

    textSize(50);
    textAlign(CENTER);
    text(player.name ,screenSection / 3 + offset + (screenSection / 6), height - 75);

    pop();
  }
  // if not zombie gamemode then work normally
  else{
    let screenSection = windowWidth / everyMovingThing.length;
    for (let thing = 0; thing < everyMovingThing.length; thing ++){
      push();
      let offset = screenSection * thing;
      stroke("black");
      rect(screenSection / 3 + offset, height, screenSection / 3, -150);
      
      textSize(30);
      text("Lives: " + everyMovingThing[thing].lives ,screenSection / 3 + offset + 10, height - 10);
      text("Health: " + everyMovingThing[thing].health ,screenSection / 3 + offset + 10, height - 40);
      if (everyMovingThing[thing].currentWeapon.ammo === Infinity){
        text("Ammo Left: " + "\u221E" ,screenSection / 3 + offset + 10, height - 70);
      }
      else{
        text("Ammo Left: " + everyMovingThing[thing].currentWeapon.ammo ,screenSection / 3 + offset + 10, height - 70);

      }
  
      textSize(50);
      textAlign(CENTER);
      text(everyMovingThing[thing].name ,screenSection / 3 + offset + screenSection / 6, height - 100);
  
      pop();
    }
  }
  
}

// displaying the bullet shot onto the screen
function displayBullet(bulletScreenX, bulletScreenY, img, direction){
  push();
  let x = bulletScreenX;
  if (direction < 0){
    scale(-1,1);
    x = -x;
  }
  imageMode(CENTER);
  image(img, x, bulletScreenY, 100, 50);
  pop();

}

// damage indicator that appears when you hit enemy
class DamageIndicator{
  constructor(x, y, amount){
    this.x = x;
    this.y = y;
    this.timestart = millis();
    this.timeEnd = 2000;
    this.amount = amount;
    this.fade = 255;
    this.fadeSpeed = 5;
    this.lastFade = 0;
  }
  display(partiX, partiY){
    push();

    textAlign(CENTER);
    textFont("Arial");
    textSize(50);
    textStyle(BOLD);
    fill(255, 0, 0, this.fade);
    text(this.amount, partiX, partiY);
    if (this.lastFade + this.fadeSpeed < millis()){
      this.fade -= 10;
      this.lastFade = millis();
    }
    pop(); 
    if (this.timestart + this.timeEnd < millis()){
      return "end";
    }

    
  }
}