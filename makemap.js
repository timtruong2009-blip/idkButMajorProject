

function makingMapScreen(){
  console.log(currentBlockColor);
  push();
  stroke(255);
  for (let y = 0; y < MAPHEIGHT; y ++){
    for (let x = 0; x < MAPWIDTH; x ++){
      if (map[y][x]=== 0){
        push();
        fill(200);
        square(x* GRIDSIZE, y * GRIDSIZE, GRIDSIZE);
        pop();
      }
      else {
        push();
        fill(color(map[y][x][0], map[y][x][1], map[y][x][2]));
        square(x* GRIDSIZE, y * GRIDSIZE, GRIDSIZE);
        pop();
      }
    }
  }
  pop();
  currentBlockColor.display();
  changeColor();
}

function drawBlock(){
  mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};

  map[mouse_press_pos.y][mouse_press_pos.x] = [r,g,b];
}

class CurrentBlockColor{
  constructor(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
  display(){
    push();

    fill(color(this.r,this.g,this.b));
    square(0,0,100);

    pop();
  }
}

function changeColor(){
  if (keyIsDown(82)){
    if (currentBlockColor.r !== 255){
      currentBlockColor.r += 1;
    }
    else{
      currentBlockColor.r = 0;
    }
  }
  if (keyIsDown(71)){
    if (currentBlockColor.g !== 255){
      currentBlockColor.g += 1;
    }
    else{
      currentBlockColor.g = 0;
    }
  }
  if (keyIsDown(66)){
    if (currentBlockColor.b !== 255){
      currentBlockColor.b += 1;
    }
    else{
      currentBlockColor.b = 0;
    }
  }
}




