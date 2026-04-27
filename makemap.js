

function makingMapScreen(){
  stroke(255);
  for (let y = 0; y < MAPHEIGHT; y ++){
    for (let x = 0; x < MAPWIDTH; x ++){
      if (map[y][x]=== 0){
        fill(200);
        square(x* GRIDSIZE, y * GRIDSIZE, GRIDSIZE);
      }
      else if (map[y][x]=== 1){
        fill("brown");
        square(x* GRIDSIZE, y * GRIDSIZE, GRIDSIZE);
      }
    }
  }
}

function drawBlock(){
  mouse_press_pos = {x : floor(mouseX / GRIDSIZE), y : floor(mouseY/ GRIDSIZE)};

  map[mouse_press_pos.y][mouse_press_pos.x] = 1;
}