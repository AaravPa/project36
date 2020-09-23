var dog, happyDog, database, foodS, foodStock;
var dog1, dog2;
var feed, addFood;
var foodObj, fedTime, lastFed;
var changeState, readState;
var currentTime;

function preload() {
  dog1 = loadImage("images/dogImg.png");
  dog2 = loadImage("images/dogImg1.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  garden = loadImage("virtual pet images/Garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database();
  dog = createSprite(250,350,10,10);
  dog.addImage(dog1);
  dog.scale = 0.25;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  var foodStock = database.ref("Food");
  foodStock.on("value", readStock);
  foodObj = new Food();
}
 
function draw() {
  background(46, 139, 87);
  foodObj.display();
   
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val(); 
  })

  if(lastFed >= 12) {
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }
  else if(lastFed == 0) {
    text("Last Feed : 12 AM", 350, 30);
  }
  else{
    text("Last Feed : "+ lastFed + "AM", 350, 30);
  }

  if(gameState != "Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else {
   feed.show();
   addFood.show(); 
   dog.addImage(dog1);
  }
  
  currentTime=hour();
  if(currentTime == (lastFed+1)) {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2)) {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime <=(lastFed+4)) {
    update("Bathing");
    foodObj.washroom();
  }
  else {
    update("Hungry");
    foodObj.display();
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(dog2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

// function writeStock(x) {
  
//   if(x <= 0) {
//     x = 0;
//   }
//   else {
//     x = x-1;
//   }
  
//   database.ref('/').update({
//     Food : x
//   })
// }