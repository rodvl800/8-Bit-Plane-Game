// Get the jet icon element from https://fontawesome.com
const jetIcon = document.querySelector('.jet-icon');
const containerWidth = document.querySelector('.container').offsetWidth;
const containerHeight = document.querySelector('.container').offsetHeight;

// Set initial position and direction
let posX = 0;
let posY = 0;
let directionX = 1;
let directionY = 1;

function animateJet() {
  posX += directionX * 2; //This moves the jet icon by a distance of 2 units in each direction
  posY += directionY * 2;

  if (posX <= 0 || posX >= containerWidth - jetIcon.offsetWidth) { //check of an icon is touching a border
    directionX = -directionX;
    jetIcon.style.transform = `scaleX(${directionX})`;
  }
  //change direction if plane hits a border (x-axis)

  if (posY <= 0 || posY >= containerHeight - jetIcon.offsetHeight) { //check of an icon is touching a border
    directionY = -directionY;
  }
  //change direction if plane hits a border (y-axis)

  // Refresh new position using css
  jetIcon.style.left = `${posX}px`;
  jetIcon.style.top = `${posY}px`;

  requestAnimationFrame(animateJet); //call the function endlessly to animate jet (function calls itself)
}
animateJet(); //initiate the animation