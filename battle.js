
function fightStart(){
  playerMoving();
  if (!map){
    return;
  }
  push();
  generateSurrounding();
  pop();

  loadPlayer();
  updatePLayer(player);
}

// make player
class PlayerBaguette{
  constructor(){
    this.x = windowWidth /2;
    this.y = windowHeight /2;
    this.speed = 10;
  }
}

function loadPlayer(){
  push();
  imageMode(CENTER);
  image(playerImg, windowWidth/2 ,windowHeight /2, 75,75 );
  pop();
}

function playerMoving(){
  
  if (keyIsDown(65)){
    player.x -= player.speed;
  }
  if (keyIsDown(68)){
    player.x += player.speed;
  }

  if (keyIsDown(83)){
    
  }
  if (keyIsDown(87)){
    playerJump(player);
  }
}

function generateSurrounding() {
  let gridX = floor(player.x / GRIDSIZE);
  let gridY = floor(player.y / GRIDSIZE);

  let whereInGridx = player.x - gridX * GRIDSIZE;
  let whereInGridy = player.y - gridY * GRIDSIZE;

  let gridOnScreenH = Math.ceil(windowHeight / GRIDSIZE) ;
  let gridOnScreenW = Math.ceil(windowWidth / GRIDSIZE) ;

  let smallestX = gridX - Math.floor(gridOnScreenW/2);
  let smallestY = gridY - Math.floor(gridOnScreenH/2);

  let biggestX = gridX + Math.floor(gridOnScreenW/2) +1;
  let biggestY = gridY + Math.floor(gridOnScreenH/2) +2;

  for (let y = smallestY; y < biggestY; y ++){
    for (let x = smallestX; x < biggestX; x ++){
      let cordX = (x - smallestX) * GRIDSIZE - whereInGridx;
      let cordY = (y - smallestY) * GRIDSIZE - whereInGridy;
      
      if (x < 0 || x > 60 || y < 0 || y > 30){
        fill("brown");
        square(cordX, cordY, GRIDSIZE);
      }
      else{
        if (map[y][x] === 0){
          push();
          fill(200);
          square(cordX, cordY, GRIDSIZE);
          pop();
        }
        else {
          push();
          fill(color(map[y][x][0], map[y][x][1], map[y][x][2]));
          square(cordX, cordY, GRIDSIZE);
          pop();
        }
      }
    }
  }
}

function playerJump(who){
  
  if (touchGround(who)){
    velocity += jumpspeed;
    who.y -= 1;
  }
}

function updatePLayer(who){
  if (!touchGround(who)){
    who.y += velocity;
    velocity += GRAVITY;
  }
}

function touchGround(who){
  if (who.y <= 500){

    return false;
  }
  else{
    velocity = 0;
    return true;
  }
  
}