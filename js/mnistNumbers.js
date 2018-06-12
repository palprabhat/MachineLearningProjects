let train_labels = [];
let train_values = [];
let test_labels = []
let test_values = [];
let test_labels_val = [];
let wt = 560;
let ht = 560;
let pixel = 28;
let pixelWt = wt/pixel;
let pixelht = ht/pixel;
let recordNum = 784; // or however many elements there are in each row
let train_index = [];
let test_index = Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
let nn, lbl;
let weights = [];
let bias = [];


// http://stackoverflow.com/questions/962802#962890
function shuffleArray(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}


function processTrainData(allText) {
  let allTextLines = allText.split(/\r\n|\n/);
  for(let k = 0; k < allTextLines.length-1; k++){
    let d = allTextLines[k].split(',');

    let arr = [];
    for(let i = 0; i < 10; i++){
      if(parseInt(d[0]) == i){
        arr[i] = 1;
      }
      else{
        arr[i] = 0;
      }
    } 

    train_labels.push(arr);
    let temp_value = [];
    for(let i = 1; i <= recordNum; i++){
      temp_value.push(parseInt(d[i])/255.0);
    }
    train_values.push(temp_value);
  }
} 

function processTestData(allText) {
  let allTextLines = allText.split(/\r\n|\n/);
  for(let k = 0; k < allTextLines.length-1; k++){
    let d = allTextLines[k].split(',');

    test_labels_val.push(parseInt(d[0]));
    let arr = [];
    for(let i = 0; i < 10; i++){
      if(parseInt(d[0]) == i){
        arr[i] = 1;
      }
      else{
        arr[i] = 0;
      }
    } 

    test_labels.push(arr);
    let temp_value = [];
    for(let i = 1; i <= recordNum; i++){
      temp_value.push(parseInt(d[i])/255.0);
    }
    test_values.push(temp_value);
  }
} 

function accuracy(actual_labels, predicted_labels){
  let count = 0;
  for(let i = 0; i < test_labels.length; i++){
    if(actual_labels[i] == predicted_labels[i]){
      count++;
    }
  }

  let acc = (count / actual_labels.length) * 100;

  return acc;
}

function drawNumber(number){
  let x = 0;
  let y = 0;
  // let pixel = number;
  noStroke();
  background(255,0,0);

  if(!(number == undefined)){
    for(let k = 0; k < recordNum; k++){
      fill(number[k]*255);
      rect(x, y, pixelWt, pixelht);
      x += pixelWt;
      if((k+1) % pixel == 0){
        y += pixelht;
        x = 0;
      }
    }
  }
}

function loadData(filePath, processData){
  $.ajax({
    type: "GET",
    url: filePath,
    async: false,
    cache: false,
    dataType: "text",
    success: processData
  });
}

function loadWeights(val){
  for(let i = 0; i < val.length; i++){
    weights.push(val[i].value)
  }
}

function loadBias(val){
  for(let i = 0; i < val.length; i++){
    bias.push(val[i].value)
  }
}

function setup(){
  // loadData("data/mnist_train.csv", function(data) {processTrainData(data);});
  loadData("data/mnist_test.csv", function(data) {processTestData(data);});

  $.ajax({
    type: "GET",
    url: "data/data/bias.json",
    async: false,
    cache: false,
    dataType: "json",
    success: function(data) {loadBias(data);}
  });

  $.ajax({
    type: "GET",
    url: "data/data/weights.json",
    async: false,
    cache: false,
    dataType: "json",
    success: function(data) {loadWeights(data);}
  });


  let cnv = createCanvas(wt, ht);

  let x_pos = (windowWidth - width) / 2;
  cnv.parent("draw-space");
  // cnv.position(x_pos, 10);

  background(0);
  noStroke();

  nn = new NeuralNetwork(784, 16, 2, 10, 0.01);

  // for (let i = 0; i < train_labels.length; ++i) train_index[i] = i;
  
  // for(let epoch = 1; epoch <= 5; epoch++){
  //   train_index = shuffleArray(train_index);
  //   console.log("Epoch: " + epoch);
  //   for(let i = 0; i < train_index.length; i++){
  //     nn.train(train_values[train_index[i]], train_labels[train_index[i]]);

  //     if(i%6000 == 0){
  //       console.log("COST: " + nn.mse);
  //     }
  //   }
  // }

  nn.initialWeightsAndBias(weights, bias);

  // let predicted_labels = [];
  // for(let i = 0; i < test_labels.length; i++){
  //   let output = nn.predict(test_values[i]);
  //   predicted_labels.push(output[0]);
  // }

  // let accuracy_score = accuracy(test_labels_val, predicted_labels);
  // console.log("Accuracy: " + accuracy_score);

  // let out_number = nn.predict(test_values[test_index]);
  // console.log(out_number);

  // drawNumber(test_values[test_index]);
  
  lbl = document.getElementById("predictLabel");
}

function draw(){
  strokeWeight(0);
  fill(255);
  if(mouseIsPressed){
    rect(mouseX, mouseY, 60, 60);
  }
}

function predictNumber(){
  let inputs = [];
  let img = get();
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    let bright = img.pixels[(i * 4)+1];
    inputs[i] = bright / 255.0;
  }

  // image(img, 0, 0);
  drawNumber(inputs)

  let out_number = nn.predict(inputs);

  lbl.innerHTML = "Neural Network thinks its a " + out_number[0];
  console.log(out_number);
}

function clearScreen(){
  background(0);
  lbl.innerHTML = "";
}

function randomNumber(){
  test_index = Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
  drawNumber(test_values[test_index]);
}