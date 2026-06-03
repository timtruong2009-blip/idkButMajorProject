
function gamemodeZombie(){
  battleSetupZombieVersion();
  map = duckMap;
  gamePhrase = "battleDuck";
}

function battleSetupZombieVersion(){
  player = new PlayerBaguette(100, 5);
  player.currentWeapon = new Pistol(weaponData[2].type, weaponData[2].bull);
  everyMovingThing.push(player);

  allPlayerHealth = 100;
  crateSpawnSpeed = 10000;
  allPlayerlives = 5;
  everyDuck = [];

  crateMillis = millis();
  duckLastSpawn = millis();
}


