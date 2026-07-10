
function customScreen(){
  image(customDemo,0,0, windowWidth, windowHeight);

  for (let butt of allButton){
    butt.display();
    if (butt.hover()){
      butt.showHighlight();
    }
    else{
      butt.color = "black";
    }
  }
  for (let slide of sliderButton){
    slide.display();
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
    this.color = "black";
  }
  display(){
    push();
    textAlign(CENTER);

    fill(this.color);
    textSize(this.size);
    textFont(myFont);
    text(this.word,this.x * this.pos,this.y,);

    pop();
  }
  hover(){
    if (mouseX > this.x * this.pos - this.size *4  && mouseX < this.x * this.pos + this.size *4  &&  mouseY < this.y && mouseY > this.y - this.size){
      return true;
    }
  }
  showHighlight(){
    this.color = "red";
  }
}

class CustomSlider{
  constructor(name, y,min, range, step){
    this.slider = createSlider(min, range, range / 10, step);
    this.slider.position(700, windowHeight - y - 30, step);

    this.range = range;
    this.name = name;
    this.y = y;
    this.ammount = 0;
  }
  display(){
    this.convert();
    this.slider.show();
    push();
    textSize(50);
    textFont(myFont);
    text(this.name, 100, windowHeight - this.y);

    textFont("Arial");
    textStyle(BOLD);
    if (this.ammount === this.range && this.name !== "BOT training only"){
      text("\u221E", 550, windowHeight - this.y);
    }
    else{
      text(this.ammount, 550, windowHeight - this.y);
    }
    
    pop();
  }
  convert(){
    this.ammount = this.slider.value();
  }
  end(){
    this.slider.hide();
  }

}


