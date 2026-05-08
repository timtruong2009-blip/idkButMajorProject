
function fightStart(){
  
  playerMoving();
  if (!map){
    return;
  }
  push();
  generateSurrounding();
  pop();

  player.loadPlayer();
  player.updatePLayer();
}

// make player
class PlayerBaguette{
  constructor(){
    this.x = windowWidth /2;
    this.y = windowHeight /2;
    this.yVelocity = 0;
    this.xVelocity = 0;

    this.jumpspeed = -20;
    this.speed = 2;
    this.maxSpeed = 10;

    this.friction = 5;
    
    this.platformY = 0;
  }
  loadPlayer(){
    push();
    imageMode(CENTER);
    image(playerImg, windowWidth/2 ,windowHeight /2, 75,75 );
    pop();
  }

  playerJump(){
    if (this.touchGround()){
      this.yVelocity += this.jumpspeed;
      this.y += this.yVelocity;
    }
  }

  searchPlatform(){
    
  }

  touchGround(){
    if (this.y <= 500){
      return false;
    }
    else{
      this.yVelocity = 0;
      return true;
    }
  }

  playerMove(direction){
    if (this.xVelocity + this.speed * direction > this.maxSpeed || this.xVelocity + this.speed * direction < -this.maxSpeed){
    }
    else{
      let stuffToAddToVelocity= 0.2 * direction * this.speed;
      this.xVelocity += stuffToAddToVelocity ;
      console.log(player.xVelocity);
    }
  }

  updatePLayer(){
    if (!this.touchGround()){
      this.yVelocity += GRAVITY;
      this.y += this.yVelocity;
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
  if (keyIsDown(83)){
    
  }
  if (keyIsDown(87)){
    player.playerJump(player);
  }
}

function generateSurrounding() {
  let gridX = floor(player.x / REALGRIDSIZE);
  let gridY = floor(player.y / REALGRIDSIZE);

  let whereInGridx = player.x - gridX * REALGRIDSIZE;
  let whereInGridy = player.y - gridY * REALGRIDSIZE;

  let gridOnScreenH = Math.ceil(windowHeight / REALGRIDSIZE) ;
  let gridOnScreenW = Math.ceil(windowWidth / REALGRIDSIZE) ;

  let smallestX = gridX - Math.floor(gridOnScreenW/2);
  let smallestY = gridY - Math.floor(gridOnScreenH/2);

  let biggestX = gridX + Math.floor(gridOnScreenW/2) +1;
  let biggestY = gridY + Math.floor(gridOnScreenH/2) +2;

  for (let y = smallestY; y < biggestY; y ++){
    for (let x = smallestX; x < biggestX; x ++){
      let cordX = (x - smallestX) * REALGRIDSIZE - whereInGridx;
      let cordY = (y - smallestY) * REALGRIDSIZE - whereInGridy;
      
      if (x < 0 || x > 60 || y < 0 || y > 30){
        fill("brown");
        square(cordX, cordY, REALGRIDSIZE);
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
    }
  }
}


