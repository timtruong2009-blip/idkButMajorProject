
function mainScreen() {
  image(startScreen, 0, 0, windowWidth, windowHeight);
  for (let button of allButton){
    if (button.hover()){
      button.showHighlight();
    }
    button.display();
  }
}

// Button for the main screen selection
class Button{
  constructor(pos, word){
    this.word = word;
    this.pos = pos;
    this.x = windowWidth - windowWidth /4;
    this.y = pos * windowHeight / 9;
    this.size = 50;
    this.transparent = 100;
  }
  display(){
    push();
    this.x = windowWidth - windowWidth /4;
    this.y = this.pos * windowHeight / 9;
    fill("black");
    textSize(this.size);
    textFont(myFont);
    text(this.word,this.x,this.y,);

    pop();
  }
  hover(){
    if (mouseX > this.x && mouseX < this.x + this.size *4 && mouseY < this.y && mouseY > this.y - this.size){
      return true;
    }
  }
  showHighlight(){
    push();
    fill(100, 100, 100, this.transparent);
    rect(0, this.y - this.size, windowWidth, this.size + 10);
    pop();
  }
}

function makeButton(){
  let allButton = [];
  for (let pos = 2; pos < 7; pos ++){
    let newButton = new Button(pos , buttonName[pos-2]);
    allButton.push(newButton);
  }
}