

function MapCampaign(){
  image(campaignscreen, 0, 0, windowWidth, windowHeight);
  for (let num = 0; num < allCampaignButton.length; num ++){
    allCampaignButton[num].display();

    if (allCampaignButton[num].hover()){
      allCampaignButton[num].textColor = 128;
      allCampaignButton[num].buttonColor = 255;
      allCampaignButton[num].stroky = true;
    }
    else{
      allCampaignButton[num].textColor = 255;
      allCampaignButton[num].buttonColor = 0;
      allCampaignButton[num].stroky = false;
    }
  }
  
}

function loadingGameMap(){
  // map = loadJSON("map_list/examplemap.json");
}

// Load all campaign level available
function loadLevelText(num){
  if (num <= 4){
    allCampaignButton.push(new CampaignButton(windowWidth/ 5 * num , windowHeight /3, num));
  }
  else{
    allCampaignButton.push(new CampaignButton(windowWidth/ 5 * (num -4), windowHeight /3 * 2.3, num));
  } 
}

class CampaignButton{
  constructor(x, y, num){
    this.x = x;
    this.y = y;
    this.radius = 100;
    this.number = num;
    this.textColor = 255;
    this.buttonColor = 0;
    this.stroky = false;
  }
  display(){
    push();
    this.turnStroke();
    textSize(100);
    fill(this.buttonColor);
    circle(this.x +30, this.y -40, this.radius *2);
    
    noStroke();  
    fill(this.textColor);
    text(this.number, this.x, this.y);
    pop();
  }
  hover(){
    if (mouseX > this.x- 80 && mouseX < this.x + this.radius + 30 && mouseY < this.y + 50  && mouseY > this.y - this.radius - 30){
      return true;
    }
  }
  turnStroke(){
    if (this.stroky){
      stroke("black");
      strokeWeight(10);
    }
    else{
      noStroke();
    }
  }

}

function loadMap(link){
  let map = loadJSON(link);
  switchPhrase("battle");
}

