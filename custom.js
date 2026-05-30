
function customScreen(){
  image(customDemo,0,0, windowWidth, windowHeight);

  for (let butt of allButton){
    butt.display();
  }
}

class CustomButton{
  constructor(pos, word){
    this.word = word;
    this.pos = pos;
    this.x = windowWidth /4;
    this.y = windowHeight /2;
    this.size = 50;
    this.transparent = 100;
  }
  display(){
    push();
    textAlign(CENTER);

    fill("black");
    textSize(this.size);
    textFont(myFont);
    text(this.word,this.x * this.pos,this.y,);

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
































