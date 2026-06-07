function setup() {
    createCanvas(800, 600);
    background(0);

    // setup text drawing params
    textSize(32);
    fill(255);
    stroke(0);
    strokeWeight(4);

    // wait for click to animate
    noLoop();
    console.log("Should not be looping now");
}

function draw() {
    background(0);
    rotate(PI/60 * frameCount);
    text("Click to begin animation", 100,100);
    text("Secret message!", 100,-100);
}

// begin animating when clicked
function mouseClicked(){
    if(isLooping()){
        noLoop();
    } 
    else{
        loop();
    }
}