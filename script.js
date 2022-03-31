//table dimensions
const height = 30;
const width = 30;
//the bigger the number the slower the snake will be moving
const speed = 80;
const main = document.getElementById("main");
//initial snake head coords
let x = 2;
let y = 3;
//initial food coords
let x1 = 2;
let y1 = 7;
let foodCord = {x:x1,y:y1};
//snake's tail coords
let x2 = 2;
let y2 = 1;
//default direction at game start
let direction = "RIGHT";
//-------------------------------------------------
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
//-------------------------------------------------
for(let x = 0;x< width;x++){
  let row = document.createElement("section");
  row.setAttribute("class","row");
  row.setAttribute("id",`r${x.toString()}`);
  main.appendChild(row);
  
  for(let y = 0;y< height;y++){
    let column = document.createElement("div");
    column.setAttribute("class","column");
    column.setAttribute("id",`r${x.toString()}c${y.toString()}`);
    document.getElementById(`r${x.toString()}`).appendChild(column);
  }
}
const BOARD = [...document.getElementById("main").getElementsByTagName("section")];
//--------------------------------------------------
let snakeHead = document.createElement("div");
snakeHead.setAttribute("id","snake-head");
let snakeHeadImg = document
const food = document.createElement("div");
food.setAttribute("id","snake-food");
BOARD[foodCord.x].children[foodCord.y].appendChild(food);
let snakeTail = document.createElement("div");
snakeTail.setAttribute("class","snake-body");
//----------------------------------------------------
//array with all snake's body parts represented as objects
let snakeBody = [
  {htmlElement:snakeHead,
  currentPosition:{x:x,y:y},
  previousPosition:{x:x,y:y}},
  {htmlElement:snakeTail,
  currentPosition:{x:x2,y:y2},
  previousPosition:{x:x2,y:y2}}
];
//------------------------------------------------------
let previousDirection;
document.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
    case 37:
      if(previousDirection !== "RIGHT"){
        direction = "LEFT";
        break;
      }
      else break
    case 38:
      if(previousDirection !== "DOWN"){
        direction = "UP";
        break;
      }
      else break
    case 39:
      if(previousDirection !== "LEFT"){
        direction = "RIGHT";
        break;
      }
      else break
    case 40:
      if(previousDirection !== "UP"){
        direction = "DOWN";
        break;
      }
      else break
    }
    
    // console.log(direction);
    // console.log("previous :",previousDirection);
});

//--------------------------------------------
//adding the snake's part in the screen 
function loadSnake(){
  snakeBody.forEach((elem)=>{
    BOARD[elem.currentPosition.x].children[elem.currentPosition.y].appendChild(elem.htmlElement)
  })
}
loadSnake();

let isEdgeReached = false;
let lost = false;
let lastElement = 1;
function myLoop(){
  setTimeout(function(){
    let snakeHead = snakeBody[0];
    isEdgeReached = false;

    //checking if the snake head has reached the extremity of the map.
    switch(true){
      case x ==height-1 && direction == "DOWN" :
        x=0;
        isEdgeReached = true;
        break;
      case y == width-1 && direction == "RIGHT" :
        y=0;
        isEdgeReached = true;
        break;
      case x == 0 && direction == "UP" :
        x = height-1;
        isEdgeReached = true;
        break;
      case y == 0 && direction == "LEFT" :
        y = height-1;
        isEdgeReached = true;
        break;

    }
    //Updating the x and y coordinates based on the current direction.
    if (!isEdgeReached){
      switch(true){
        case direction == "UP" :
          x-=1;
          break;
        case direction == "DOWN" :
          x+=1;
          break;
        case direction == "RIGHT" :
          y+=1;
          break;
        case direction == "LEFT" :
          y-=1;
          break;
      }
    }
    //Making the snake's current position as it's previous position
    snakeHead.previousPosition = snakeHead.currentPosition;
    //Updating the current position of the snake based on the direction.
    snakeHead.currentPosition = {x:x,y:y};
    let nextMove = BOARD[snakeHead.currentPosition.x].children[snakeHead.currentPosition.y];
    //If the next move has a child element and that element isn't food means the player has lost
    if(nextMove.hasChildNodes() && nextMove.firstChild !== food){
      lost = true;
    }
  
    //iterating over the snake's body parts and updating every part's position
    //each part will get the previous postion of the part that's located before it as it's current position
    snakeBody.forEach((elem,index)=>{
      //since the snake's head position has been already updated we start from the following part which will have an index > 0
      //each part gets the previous position of the element before it as it's current position...
      if(index >0){
        elem.previousPosition = elem.currentPosition;
        elem.currentPosition = snakeBody[index-1].previousPosition;
      }
    })
    
    //checking if the snake is on the food
    if(snakeHead.previousPosition.x== foodCord.x && snakeHead.previousPosition.y == foodCord.y){
      //when the snake's head reaches the food we create a new body part and we add it to the snakeBody object
      let newBody = document.createElement("div");
      newBody.setAttribute("id",`body${lastElement}`);
      newBody.setAttribute("class","snake-body");
      //The new body current position will be the last element's previous position in the snakeBody object
      let newBodyObj = {
        htmlElement:newBody,
        currentPosition:snakeBody[lastElement].previousPosition,
        previousPosition:{x:null,y:null}
      };
      snakeBody.push(newBodyObj);
      //spawning the food in a random position in the map and that spot should not have snake part
      while(BOARD[foodCord.x].children[foodCord.y].hasChildNodes()){
        foodCord = {x:getRandomInt(width),y:getRandomInt(height)};
      }
      BOARD[foodCord.x].children[foodCord.y].append(food);
      lastElement++;
}
    if(!lost){
      loadSnake();
    }
    if(x<=height && y<= width && !lost ){
      previousDirection = direction;
      myLoop();
    }
  },speed)

}
myLoop();
