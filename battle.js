
function fightStart(){
  if (!map){
    return;
  }
  push();
  displayMap();
  pop();
}

// make player
class PlayerBaguette{
  constructor(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;

  }
}




