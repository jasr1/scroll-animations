const html = document.documentElement;
const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const canvasConstraint = document.querySelector('.canvas-constraint');
const preloadedImage = document.querySelector('.preloadedimage');
const imageElement = document.createElement('img');
const resetButton = document.querySelector("button.reset-button");
const zoomButton = document.querySelector("button.zoom");
const largeZoomButton = document.querySelector("button.large-zoom");
const zoomOutButton = document.querySelector("button.zoom-out")
const largeZoomOutButton = document.querySelector('button.large-zoom-out')


//enter the number of images in the set
const frameCount = 123;

//enter the location of the images
const currentFrame = index => 
    `./img/${index.toString()}.jpg`;

//preload the images in order to prevent choppiness when scrolling
function preloadImages() {
    for (let i = 0; i < frameCount; i++) {
        var img = new Image(1280,720);
        img.src = `./img/${i.toString()}.jpg`;
        document.querySelector(".preloadedimages").appendChild(img);
    };
};
preloadImages();

//creating a new img element and setting its source to be the first image in the series - so when the page loads the first image in the series is shown on the screen. Note this code does not actually place the image in the canvas - that happens below on line 30
const img = imageElement;
img.src = currentFrame(1);

//set the height and width of the canvas to the image height and width - since all images are sequential the two values will not change as the image changes
// canvas.width = preloadedImage.width;
// canvas.height = preloadedImage.height;
canvas.width = 1280;
canvas.height = 720;

//storing the original canvas width in a new variable for use when we want to reset all customizations
var originalCanvas = canvas.width;

//once the new img element loads, then run a function that draws the image (basically places the image in the 2d space) that is specified by the current frame into the canvas
img.onload = function(){
  context.drawImage(img, 0, 0);
}

//now that we have the first image on the screen, we want to see the rest of the images as the user scrolls. this function takes in a parameter (which will end up being a number) that specifies what image to show
function updateImage(index) {
  img.src = currentFrame(index);
  context.drawImage(img, 0, 0);
}

//resetting customizations
function resetCustomizations() {
  zoomInToggle = 0;
  zoomOutToggle = 0;
  resetButton.style.display = "none";
  zoomButton.style.backgroundColor = "transparent"
  zoomButton.style.borderColor = "white"
  largeZoomButton.style.display = "none";
  largeZoomButton.style.backgroundColor = "transparent"
  largeZoomButton.style.borderColor = "white"
  zoomOutButton.style.backgroundColor = "transparent"
  zoomOutButton.style.borderColor = "white"
  largeZoomOutButton.style.display = "none";
  largeZoomOutButton.style.backgroundColor = "transparent"
  largeZoomOutButton.style.borderColor = "white"
  updateImage(1);
  canvas.style.width = originalCanvas + "px";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  zoomInAmount = 0;
  zoomOutAmount = 0;
}

function zoom(i) {
  canvas.style.width = i + 'px';
}

//zoom in code
var zoomInToggle = 0;
function zoomIn() {
resetCustomizations();
  if(zoomInToggle == 1) {
    zoomInToggle = 0;
    zoomOutToggle = 1;
    largeZoomButton.style.display = "none";
    resetButton.style.display = "none";
    zoomButton.style.backgroundColor = "transparent"
    zoomButton.style.borderColor = "white"
    resetCustomizations();
  } else {
    zoomInToggle = 1;
    zoomOutToggle = 0;
    largeZoomButton.style.display = "block";
    resetButton.style.display = "block";
    zoomButton.style.backgroundColor = "#0072ff"
    zoomButton.style.borderColor = "#0072ff"
    zoomInAmount = 0;
  }
}
var zoomInAmount = 0;
function setLargeZoom() {
  if(zoomInAmount == 0) {
    zoomInAmount = 6000;
    largeZoomButton.style.backgroundColor = "#0072ff"
    largeZoomButton.style.borderColor = "#0072ff"
  } else {
    zoomInAmount = 0;
    largeZoomButton.style.backgroundColor = "transparent"
    largeZoomButton.style.borderColor = "white"
  }
}

//zoom out code
var zoomOutToggle = 0;
function zoomOut() {
  resetCustomizations();
  if(zoomOutToggle == 1) {
    zoomOutToggle = 0;
    zoomInToggle = 1
    largeZoomOutButton.style.display = "none";
    resetButton.style.display = "none";
    zoomOutButton.style.backgroundColor = "transparent"
    zoomOutButton.style.borderColor = "white"
    resetCustomizations();
  } else {
    zoomOutToggle = 1;
    zoomInToggle = 0;
    largeZoomOutButton.style.display = "block";
    resetButton.style.display = "block";
    zoomOutButton.style.backgroundColor = "#0072ff"
    zoomOutButton.style.borderColor = "#0072ff"
    zoomOutAmount = 0;
  }
}
var zoomOutAmount = 0
function setLargeZoomOut() {
  if(zoomOutAmount == 0) {
    zoomOutAmount = 6000;
    largeZoomOutButton.style.backgroundColor = "#0072ff"
    largeZoomOutButton.style.borderColor = "#0072ff"
  } else {
    zoomOutAmount = 0;
    largeZoomOutButton.style.backgroundColor = "transparent"
    largeZoomOutButton.style.borderColor = "white"
  }
}



window.addEventListener("scroll", () => {
  preloadedImage.remove();
  let maxScrollTop = html.scrollHeight - document.documentElement.clientHeight
  let scrollTop = html.scrollTop;
  let scrollFraction = scrollTop/maxScrollTop;
  let frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction*frameCount));

  if(zoomInToggle == 1 && zoomInAmount > 0) {
    updateImage(frameIndex+1);
    let zoomAmount = zoomInAmount - canvas.width;
    let zoomFraction = scrollFraction*zoomAmount;
    zoom(zoomFraction + canvas.width);
  } 
  else if(zoomInToggle == 1) {
    updateImage(frameIndex+1);
    let zoomAmount = 2480 - canvas.width;
    let zoomFraction = scrollFraction*zoomAmount;
    zoom(zoomFraction + canvas.width);
  }
  else if(zoomInToggle == 0 && zoomOutAmount == 0 && zoomOutToggle == 1){
    updateImage(frameIndex+1)
    let zoomOutAmount = canvas.width - 2000;
    let zoomFraction = scrollFraction*zoomOutAmount
    zoom(zoomFraction + canvas.width)
  }
  else if(zoomInToggle == 0 && zoomOutAmount > 0 && zoomOutToggle == 1){
    updateImage(frameIndex+1)
    let zoomAmount = canvas.width - zoomOutAmount;
    let zoomFraction = scrollFraction*zoomAmount
    zoom(zoomFraction + canvas.width)
  }
  else {
    updateImage(frameIndex+1);
  }
})