
function MapCampaign(){
  image(campaignscreen, 0, 0, windowWidth, windowHeight);
  for (let num = 0; num < allCampaignButton.length; num ++){
    allCampaignButton[num].display();
  }
  
}

function loadingGameMap(){
  // map = loadJSON("map_list/examplemap.json");
}


function loadLevelText(num){
  if (num <= 4){
    allCampaignButton.push(new CampaignButton(400 * num -200, windowHeight /3, num));
  }
  else{
    allCampaignButton.push(new CampaignButton(400 * (num -4) -200, windowHeight /3 * 2.3, num));
  } 
}

class CampaignButton{
  constructor(x, y, num){
    this.x = x;
    this.y = y;
    this.number = num;
  }
  display(){
    push();
    textSize(100);
    fill("black");
    circle(this.x +30, this.y -40, 200);
    fill("white");
    text(this.number, this.x, this.y);
    pop();
  }
}