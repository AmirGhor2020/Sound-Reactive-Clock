// Clock face variables
const numCircles = 40;
const numbers01 = _.range(numCircles);

let mic;
let myFont;
let v;

// MilliSecond variables
let lastSecond = -1
let baseMillis = 0

let red = 0
let green = 0
let blue = 0
let opac = 0
let colourChanger = true

// Mouse tracker variables
let x = 1
let y = 1

////////////////////////////////////////////////////////////////Functions//////////////////////////////////////////////////////////Functions////////////////////////
////////////////////////////////Functions///////////////////////////////Functions////////////////////////////////////////////////////////Functions///////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the font function //////////////////////////////////////////
function preload() {
  myFont = loadFont('NovaMono-Regular.ttf')
}

// Day mode and night mode clock face //////////////////////////////
function myClockFace() {
  let vol = mic.getLevel();
  for (let n of numbers01) {
    if (colourChanger) {
      v = vol * 10000
    } else {
      v = vol * 10000
    }
    let size = map(n, 0, numCircles, 1100, v);
    
    // Day mode // White mode //////////////////////////////////////
    if (colourChanger) {
      red = map(n, 0, numCircles, random(250, 255), 0);
      green = map(n, 0, numCircles, random(250, 255), 0);
      blue = map(n, 0, numCircles, random(250, 255), 0);
      opac = map(n, 0, numCircles, 0, random(250, 255));
    } else { // Night mode // Red mode /////////////////////////////
      red = map(n, 0, numCircles, random(250, 255), 0);
      green = 0
      blue = 0
      opac = map(n, 0, numCircles, 0, random(250, 255));
    }
    fill(red, green, blue, opac);
    ellipse(0, 0, size, size);
  }
}
// Night mode click face ///////////////////////////////////////////
function myClickFace() {
  let vol = mic.getLevel();
  for (let n of numbers01) {
    let size = map(n, 0, numCircles, 250, vol * 400);
    // Night mode / Red mode ///////////////////////////////////////
    if (!colourChanger) {
      red = map(n, 0, numCircles, random(250, 255), 200);
      green = 255
      blue = 255
      opac = map(n, 0, numCircles, 0, random(50, 51));
      fill(red, green, blue, opac);
      ellipse(cos(45) * 450 - 20, -sin(45) * 450 + 20, size, size);
    } 
  }
}

function fractionalSecond() {
  if (second() != lastSecond) {
    baseMillis = millis();
    lastSecond = second();
  }
  var millIsWithinSec = millis() - baseMillis
  return second() + (millIsWithinSec / 1000)
}

function timeFunction() {
  noFill();
  let endS = map(second(), 0, 60, 0, 360)
  let endM = map(minute(), 0, 60, 0, 360)
  let x1 = map(second(), 0, 60, 0, 6)
  let endH = map(hour() % 12, 0, 12, 0, 360)
  let x2 = map(minute(), 0, 60, 0, 30)
  let sweepSec = map(fractionalSecond(), 0, 60, 0, 360)
  push()
  rotate(-90);
  strokeWeight(10)
  if (colourChanger) {
    stroke(0, 100)
  } else {
    stroke(255, 100)
  }
  // Second ////////////////////////////////////////////////////////
  push();
  rotate(sweepSec);
  circle(361, 0, 30)
  strokeWeight(2)
  line(361, 0, 899, 0)
  pop();
  // Minute ////////////////////////////////////////////////////////
  push();
  rotate(endM + x1);
  circle(310, 0, 40)
  strokeWeight(2)
  line(310, 0, 899, 0)
  pop();
  // Hours /////////////////////////////////////////////////////////
  push();
  rotate(endH + x2);
  circle(240, 0, 70)
  strokeWeight(2)
  line(240, 0, 899, 0)
  pop()
  pop()
}

// am and pm ///////////////////////////////////////////////////////
function myTopText(Opa01, Opa02) {
  if (colourChanger) {
    fill(0, Opa01)
    textAlign(LEFT)
    text("pm", -1, -410)
    fill(0, Opa02)
    textAlign(RIGHT)
    text("am", -2, -410)
  } else {
    fill(255, Opa01)
    textAlign(LEFT)
    text("pm", -1, -410)
    fill(255, Opa02)
    textAlign(RIGHT)
    text("am", -2, -410)
  }
}

// Button + Click //////////////////////////////////////////////////
// "Is the pointer inside the circle?"
function insideCircle(rotAng) {
  let d = dist(width / 2 + cos(rotAng) * 450, height / 2 - sin(rotAng) * 450, mouseX, mouseY)
  if (d < 100) {
    return true
  } else {
    return false
  }
}
// "Yes now the pointer is inside the circle (Click). Lets change the circle's property."
function insideCircleChange(rotAng, red, green, blue, opa) {
  let x = 200
  if (insideCircle(rotAng)) {
    x = 220
    fill(red, green, blue, 100)
  } else {
    fill(red, green, blue, opa)
  }
  push()
  rotate(-rotAng)
  circle(450, 0, x)
  pop()
}
// Click function
function mouseClicked() {
  if (insideCircle(45)) {
    colourChanger = !colourChanger
  }
}

//////////////Setup////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Setup//////////////////////Setup///////////////////////Setup/////////////////////////////////////////////////////////////////
///////////////Setup////////////////////////////////////////////////////////////////////////////////////////

function setup() {
  createCanvas(1000, 1000);
  noStroke();
  angleMode(DEGREES)
  textFont(myFont)
  fill(255,0,0)
  // Microphone code
  mic = new p5.AudioIn();
  mic.start();
}

//////////////Draw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////Draw//////////////////////Draw///////////////////////Draw/////////////////////////////////////////////////////////////////
///////////////Draw////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  // Backgtound is changing with every click /////////////////////
  if (colourChanger) {
    background(255)
    fill(255,0,0)
  } else {
    background(255, 0, 0)
    fill(255)
  }
  
  // Easeing the mouse tracker ///////////////////////////////////
  x= x+(mouseX -x)/20
  y =y+(mouseY -y)/20
  ellipse(x, y, 40, 40);
  
  translate(width / 2, height / 2)
  
  insideCircleChange(45, 200, 200, 200, 100)
  myClickFace()
  myClockFace()
  timeFunction()
  
  // Bonous
  let vol = mic.getLevel();
  if (vol * 100 > 40) {
    fill(255, 255)
    circle(0, 0, 2)
  }

  // Text AM and PM ///////////////////////////////////////////////////
  // Date & time on top of the canvas
  textSize(70)
  if (hour() > 12 && hour() < 24) {
    myTopText(200, 40) // am and pm function //////////////////////////
  } else {
    myTopText(40, 200)
  }
  textSize(20)
  
  if (colourChanger) {
    fill(0, 200)
  } else {
    fill(255, 200)
  }
  textAlign(RIGHT)
  text(nf(day(), 2, 0) + '-' + nf(month(), 2, 0) + '-' + year(), -4, -452)
  textAlign(LEFT)
  text('Local', 4, -470)
  text(nf(hour(), 2, 0) + ':' + nf(minute(), 2, 0) + ':' + nf(fractionalSecond(), 2, 2), 4, -452)
  push()
  textAlign(CENTER)
  translate(360, -360)
  rotate(45)
  text('Click', 0, 0)
}
