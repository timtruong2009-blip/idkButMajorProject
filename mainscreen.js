function mainScreen() {
  image(startScreen, 0, 0, windowWidth, windowHeight);
  for (let button of allButton){
    button.display();
    button.hover();
  }
}


class Button{
  constructor(x,y, word){
    this.word = word;
    this.x = x;
    this.y = y;
    this.size = 70;
  }

  display(){
    fill("black");
    textSize(this.size);
    textFont(myFont);
    text(this.word,this.x,this.y,);
    fill("red");
    rect(this.x, this.y, this.x - this.size, this.y - this.size);
  }
  hover(){
    if (mouseX < this.x && mouseX > this.x - this.size && mouseY < this.y && mouseY > this.y - this.size){
      console.log(this.word);
    }
  }

}

function makeButton(){
  for (let pos = 2; pos < 7; pos ++){
    let newButton = new Button(windowWidth - windowWidth /4, pos * windowHeight / 9, buttonName[pos-2]);
    allButton.push(newButton);
  }
  // let newButton = new Button();
}