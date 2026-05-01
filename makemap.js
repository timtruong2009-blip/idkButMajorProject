

function makingMapScreen(){
  
  displayMap();
  

  if (currentBlockColor.currentDisplay){
    currentBlockColor.display();
  }
  else{
    currentBlockColor.r.hide();
    currentBlockColor.g.hide();
    currentBlockColor.b.hide();
  }
  
  changeColor();
}

function displayMap(){
  push();
  stroke(255);
  for (let y = 0; y < MAPHEIGHT; y ++){
    for (let x = 0; x < MAPWIDTH; x ++){
      if (map[y][x] === 0){
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
}

function drawBlock(){
  mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};
  currentBlockColor.convert();
  map[mouse_press_pos.y][mouse_press_pos.x] = [currentBlockColor.rValue,currentBlockColor.gValue,currentBlockColor.bValue];
}

class CurrentBlockColor{
  constructor(){
    this.r = createSlider(0,255);
    this.g = createSlider(0,255);
    this.b = createSlider(0,255);
    this.currentDisplay = false;
    
    this.r.position(300, 10);
    this.g.position(300, 30);
    this.b.position(300, 50);

    this.rValue;
    this.gValue;
    this.bValue;
  }
  display(){
    this.convert();
    this.r.show();
    this.g.show();
    this.b.show();

    text("R", 290,25);
    text("G", 290,45);
    text("B", 290,65);
    
    push();
    fill(color(this.rValue,this.gValue,this.bValue));
    square(0,0,300,300);
    pop();
  }
  convert(){
    this.rValue = this.r.value();
    this.gValue = this.g.value();
    this.bValue = this.b.value();
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




