
function fightStart(){
  playerMoving();
  if (!map){
    return;
  }
  push();
  generateSurrounding();
  pop();

  player.searchPlatform();
  player.updatePlayer();
  player.loadPlayer(player.xPosOnScreen, player.yPosOnScreen);
  
  bot.searchPlatform();
  // bot.loadPlayer(bot.xPosOnScreen, bot.yPosOnScreen);
  bot.updatePlayer();

  push();
  stroke("black");
  pop();
}

// make player
class PlayerBaguette{
  constructor(){
    this.opponent = [];

    this.x = windowWidth /2 + 100;
    this.y = -2000;
    this.xPosOnScreen = 0;
    this.yPosOnScreen = 0;

    this.yVelocity = 0;
    this.xVelocity = 0;

    this.jumpspeed = -20;
    this.speed = 2;
    this.maxSpeed = 10;

    this.friction = 5;
    
    this.platformY = 0;
  }
  loadPlayer(x,y){
    push();
    imageMode(CENTER);
    image(playerImg, x, y -30, 75,75 );
    pop();
  }

  playerJump(){
    if (this.touchGround()){
      this.yVelocity += this.jumpspeed;
      this.y += this.yVelocity;
    }
  }

  searchPlatform(){
    if (this.yVelocity >= 0){
      let gridX = floor(this.x / REALGRIDSIZE);
      let gridY = floor(this.y / REALGRIDSIZE);

      if (!this.touchGround()){
        this.platformY = structuredClone(deathY);
      }
      if (gridX <= 0 || gridX >= 60 || gridY <= 0 || gridY >= 30){
      }
      else if (map[gridY +1][gridX] !== 0){
        this.platformY = (gridY +1 ) * REALGRIDSIZE;
      }
      else{
        this.platformY = structuredClone(deathY);
      }
    }
  }

  touchGround(){
    if (this.y <= this.platformY ){
      return false;
    }
    else{
      // if (this.y <= this.platformY -2){
      //   this.y += 1;
      // }
      this.yVelocity = 0;
      // this.y = structuredClone(this.platformY -1);
      return true;
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

  updatePlayer(){
    if (!this.touchGround()){
      this.yVelocity += GRAVITY;
      if (this.yVelocity >= 20){
        this.yVelocity = 20;
      }
      if (this.y + this.yVelocity >= this.platformY ){
        print("HA");
        this.y = structuredClone(this.platformY );
      }
      else{
        this.y += this.yVelocity;
      }
    }
    else{
      print("sad");
    }
    this.x += this.xVelocity;
    
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

  moveDown(){
    if (this.touchGround()){
      this.y += 5;
    }
  }

  displayOpponent(){
    // for (let thing of everyMovingThing){
    //   thing.x ;
    // }
  }
}

class BotPlayer extends PlayerBaguette{
  constructor(){
    super();
  }
}


class Weapon{
  constructor(name){
    this.bulletList = [];
    this.name = name;
    this.range = 0;
    this.damage = 0;
    this.frequency = 0;
    this.lastTimeShot = 0;
  }
  displayWeapon(x,y){
    push();
    image(this.name, x, y);
    pop();
  }
  shoot(){

  }
}

function playerMoving(){
  if (keyIsDown(65)){
    player.playerMove(-1);
  }
  else if (keyIsDown(68)){
    player.playerMove(1);
  }
  else{
    player.loseMomentum();
  }
  if (keyIsDown(87)){
    player.playerJump();
  }
}

function generateSurrounding() {
  let gridX = floor(player.x / REALGRIDSIZE);
  let gridY = floor(player.y / REALGRIDSIZE);

  let botGridX = floor(bot.x / REALGRIDSIZE);
  let botGridY = floor(bot.y / REALGRIDSIZE);

  let whereInGridx = player.x - gridX * REALGRIDSIZE;
  let whereInGridy = player.y - gridY * REALGRIDSIZE;

  let gridOnScreenH = Math.ceil(windowHeight / REALGRIDSIZE) ;
  let gridOnScreenW = Math.ceil(windowWidth / REALGRIDSIZE) ;

  let smallestX = gridX - Math.floor(gridOnScreenW/2);
  let smallestY = gridY - Math.floor(gridOnScreenH/2);

  let biggestX = gridX + Math.ceil(gridOnScreenW/2) +1;
  let biggestY = gridY + Math.ceil(gridOnScreenH/2) +2;

  for (let y = smallestY; y < biggestY; y ++){
    for (let x = smallestX; x < biggestX; x ++){
      let cordX = (x - smallestX) * REALGRIDSIZE - whereInGridx;
      let cordY = (y - smallestY) * REALGRIDSIZE - whereInGridy;
      
      if (x < 0 || x > 60 || y < 0 || y > 30){
        fill(200);
        square(cordX, cordY, REALGRIDSIZE);
      }

      else if (x === gridX && y === gridY){
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
        else {
          push();
          fill(color(map[y][x][0], map[y][x][1], map[y][x][2]));
          square(cordX, cordY, REALGRIDSIZE);
          pop();
        }
      }
      if (x === botGridX && y === botGridY){
        push();
        fill("red");
        square(cordX, cordY, REALGRIDSIZE);

        fill("red");
        
        // circle(cordX + whereInGridx, cordY + whereInGridy,10);
                                                    
        // player.xPosOnScreen = cordX + whereInGridx;
        // player.yPosOnScreen = cordY + whereInGridy;

        pop();
      }
    }
  }
  
}


