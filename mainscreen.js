
function mainScreen() {
  image(startScreen, 0, 0, windowWidth, windowHeight);
  for (let button of allButton){
    if (button.hover()){
      button.showHighlight();
    }
    button.display();
  }
}

class Button{
  constructor(x,y, word){
    this.word = word;
    this.x = x;
    this.y = y;
    this.size = 50;
    this.transparent = 100;
  }
  display(){
    fill("black");
    textSize(this.size);
    textFont(myFont);
    text(this.word,this.x,this.y,);
  }
  hover(){
    if (mouseX > this.x && mouseX < this.x + this.size *4 && mouseY < this.y && mouseY > this.y - this.size){
      return true;
    }
  }
  showHighlight(){
    fill(100, 100, 100, this.transparent);
    rect(0, this.y - this.size, windowWidth, this.size + 10);
  }
}

function makeButton(){
  for (let pos = 2; pos < 7; pos ++){
    let newButton = new Button(windowWidth - windowWidth /4, pos * windowHeight / 9, buttonName[pos-2]);
    allButton.push(newButton);
  }
}