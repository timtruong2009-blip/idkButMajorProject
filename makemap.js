

function makingMapScreen(){
  
  push();
  stroke(255);
  displayMap();
  pop();
  if (mouseIsPressed === true && !currentBlockColor.currentDisplay){
    drawBlock();
  }
  
  if (currentBlockColor.currentDisplay){
    currentBlockColor.display();
  }
  else{
    currentBlockColor.rc.hide();
    currentBlockColor.gc.hide();
    currentBlockColor.bc.hide();
  }
}

function displayMap(){
  for (let y = 0; y < MAPHEIGHT; y ++){
    for (let x = 0; x < MAPWIDTH; x ++){
      if (map[y][x] === 0 || map[y][x] === 1 || map[y][x] === 2){
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
}

function drawBlock(){
  mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};
  currentBlockColor.convert();
  map[mouse_press_pos.y][mouse_press_pos.x] = [currentBlockColor.rValue,currentBlockColor.gValue,currentBlockColor.bValue];
}

class CurrentBlockColor{
  constructor(){
    this.rc = createSlider(0,255);
    this.gc = createSlider(0,255);
    this.bc = createSlider(0,255);
    this.currentDisplay = false;
    
    this.rc.position(300, 10);
    this.gc.position(300, 30);
    this.bc.position(300, 50);

    this.rValue;
    this.gValue;
    this.bValue;
  }
  display(){
    this.convert();
    this.rc.show();
    this.gc.show();
    this.bc.show();

    text("R", 290,25);
    text("G", 290,45);
    text("B", 290,65);
    
    push();
    fill(color(this.rValue,this.gValue,this.bValue));
    square(0,0,300,300);
    pop();
  }
  convert(){
    this.rValue = this.rc.value();
    this.gValue = this.gc.value();
    this.bValue = this.bc.value();
  }

}





