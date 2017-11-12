var img;
var imgDropped;

var redImg;
var greenImg;
var blueImg;
var rgbImg;
var d;
var redShift = 1;
var blueShift = 1;
var greenShift = 1;
var stepSlice;
var stepTune;
var stepCount = 35;
var stepWidth = 1648;
var stepHeight = 128;
var tuneY = 3;
var tuneX = 0;
var tuneCenterX;

function setup() {

  createCanvas(windowWidth, windowHeight);
  background(0);
  QuickSettings.useExtStyleSheet();

  //Setup
  gui1 = QuickSettings.create(500, 0, "Image Loader")
    .addFileChooser("Image Chooser", "Choose a primary image...", "image/*", imgChosen)
    .addImage("Image", "");

  gui2 = QuickSettings.create(windowWidth - 270, 0, "Image Tuner")
    .addNumber("Step Count", 1, 128, stepCount, 1, tuneImage)
    .addNumber("Step Width", 1, 2048, stepWidth, 1, tuneImage)
    .addNumber("Step Height", 1, 1024, stepHeight, 1, tuneImage)
    .addNumber("TuneY", 0, 64, tuneY, 1, tuneImage)
    .addNumber("TuneX", 0, 64, tuneX, 1, tuneImage)
    .addNumber("Red Shift", 0, 64, 2, 1)
    .addNumber("Green Shift", 0, 64, 32, 1)
    .addNumber("Blue Shift", 0, 64, 4, 1)
    .addButton("Save Image", saveImage)
    .addButton("Draw Image", tuneImage);

  //.addNumber("TuneX Center", 0, 64, tuneCenterX, 1, tuneImage)
  ;
  noLoop();
}

function saveImage() {
  saveCanvas("juno", "png");
}

function imgChosen(file) {
  var temp = URL.createObjectURL(gui1.getValue("Image Chooser"));
  gui1.setValue("Image", temp);
  img = loadImage(temp, drawImg);
  imgDropped = true;
}

function tuneImage() {
  stepCount = gui2.getValue("Step Count");
  stepWidth = gui2.getValue("Step Width");
  stepHeight = gui2.getValue("Step Height");
  tuneX = gui2.getValue("TuneX");
  tuneY = gui2.getValue("TuneY");
  redShift = gui2.getValue("Red Shift");
  blueShift = gui2.getValue("Green Shift");
  greenShift = gui2.getValue("Blue Shift");
  drawImg();
}

function drawImg() {

  img.loadPixels();
  d = pixelDensity();
  stepSlice = (4 * (img.width * d) * stepHeight * d);
  stepTune = 4 * tuneY * img.width;



  //RED
  redImg = createImage(img.width, img.height);
  redImg.loadPixels();
  redPanelShift = stepSlice/redShift;

  for (var i = 0; i < stepCount; i++) {
    var start = stepSlice + stepSlice + stepSlice * (i * 3);
    var stop = stepSlice + stepSlice + stepSlice * (i * 3 + 1);
    for (var j = start; j <= stop; j += 4) {
      var offset = (j - stepSlice * i * 2) - stepTune * i;
      redImg.pixels[offset + 0 + redPanelShift] = img.pixels[j + 0];
      redImg.pixels[offset + 1 + redPanelShift] = img.pixels[j + 1];
      redImg.pixels[offset + 2 + redPanelShift] = img.pixels[j + 2];
      redImg.pixels[offset + 3 + redPanelShift] = 255;
    }
  }
  redImg.updatePixels();



  //GREEN
  greenImg = createImage(img.width, img.height);
  greenImg.loadPixels();
  var greenPanelShift = stepSlice/greenShift;

  for (var i = 0; i < stepCount; i++) {
    var start = stepSlice + stepSlice * (i * 3);
    var stop = stepSlice + stepSlice * (i * 3 + 1);
    for (var j = start; j <= stop; j += 4) {
      var offset = (j - stepSlice * i * 2) - stepTune * i;
      greenImg.pixels[offset + 0 + greenPanelShift] = img.pixels[j + 0];
      greenImg.pixels[offset + 1 + greenPanelShift] = img.pixels[j + 1];
      greenImg.pixels[offset + 2 + greenPanelShift] = img.pixels[j + 2];
      greenImg.pixels[offset + 3 + greenPanelShift] = 255;
    }
  }
  greenImg.updatePixels();
  
  
  
  //BLUE
  blueImg = createImage(img.width, img.height);
  blueImg.loadPixels();
  var bluePanelShift = stepSlice/blueShift;

  for (var i = 0; i < stepCount; i++) {
    var start = stepSlice * (i * 3);
    var stop = stepSlice * (i * 3 + 1);
    for (var j = start; j <= stop; j += 4) {
      var offset = (j - stepSlice * i * 2) - stepTune * i;
      blueImg.pixels[offset + 0 + bluePanelShift] = img.pixels[j + 0];
      blueImg.pixels[offset + 1 + bluePanelShift] = img.pixels[j + 1];
      blueImg.pixels[offset + 2 + bluePanelShift] = img.pixels[j + 2];
      blueImg.pixels[offset + 3 + bluePanelShift] = 255;
    }
  }
  blueImg.updatePixels();



  //RGB
  rgbImg = createImage(img.width, img.height);
  rgbImg.loadPixels();

  for (var i = 0; i < img.width * img.height * 4; i += 4) {

    rgbImg.pixels[i + 0] = (redImg.pixels[i + 0] + redImg.pixels[i + 0] + redImg.pixels[i + 0]) / 3;
    rgbImg.pixels[i + 1] = (greenImg.pixels[i + 1] + greenImg.pixels[i + 1] + greenImg.pixels[i + 1]) / 3;
    rgbImg.pixels[i + 2] = (blueImg.pixels[i + 2] + blueImg.pixels[i + 2] + blueImg.pixels[i + 2]) / 3;
    rgbImg.pixels[i + 3] = 255;

  }
  rgbImg.updatePixels();



  resizeCanvas(img.width * 4, stepCount * stepHeight);
  background(0);
  image(redImg, 0, 0);
  image(greenImg, img.width, 0);
  image(blueImg, img.width * 2, 0);
  image(rgbImg, img.width * 3, 0);
}