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
  posX += directionX * 2;
  posY += directionY * 2;

  if (posX <= 0 || posX >= containerWidth - jetIcon.offsetWidth) {
    directionX = -directionX;
    jetIcon.style.transform = `scaleX(${directionX})`;
  }
  //change direction if plane hits a border (x axis)
  if (posY <= 0 || posY >= containerHeight - jetIcon.offsetHeight) {
    directionY = -directionY;
  }
  //change direction if plane hits a border (y axis)

  // Refresh new position
  jetIcon.style.left = `${posX}px`;
  jetIcon.style.top = `${posY}px`;

  requestAnimationFrame(animateJet);
}

animateJet();