// some global params
const CANVASWIDTH = 400;
const CANVASHEIGHT = 750;
const DOWNSCALE = 1;
const ELEVATIONRESOLUTION = 0.02;

class DeltaScene{
    terain;
    water;
    #width;
    #height;
    #maxElevation = 1;
    #maxWaterDepth = 1;

    constructor(width, height){
        this.#width = width;
        this.#height = height;

        this.terain = new NDArray(0, this.#width, this.#height);
        this.water = this.terain.newLike(0);
    }

    #linearGradient(i, j){
        // linear gradient from top to bottom at pos (i,j)
        return 1 - (j/this.#height);
    }

    #applyNoise(i, j, elevationResolution, val=-1, strength=0.5){
        // apply noise to the array at pos (i,j)
        let i_scaled = i * elevationResolution;
        let j_scaled = j * elevationResolution;

        let addedNoise = strength * noise(i_scaled,j_scaled);

        val = val<0 ? addedNoise : ((1-strength)*val) + addedNoise;

        return val
    }

    generateTerain(elevationResolution, octaves, scaling, noiseStrength){
        /* Generates terrain for the scene which is based on an overlay of
        mutli-octave Perlin noise over a linear gradient which runs high to low
        from north to south.
        */
        let val, maxElevation = 0;

        // p5.js noise octave setter (not in local docs?)
        noiseDetail(octaves,scaling);

        for(let i=0;i<this.#width;i++){
            for(let j=0;j<this.#height;j++){
                val = this.#applyNoise(i,
                                       j,
                                       elevationResolution,
                                       this.#linearGradient(i,j),
                                       noiseStrength);
                maxElevation = max(maxElevation, val);
                this.terain.array[i][j] = val;
            }
        }
        this.#maxElevation = maxElevation;
    }

    drawTerain(baseColor = [255,255,255]){
        let currElevation, currERatio, currColor;
        for(let i=0;i<this.#width;i++){
            for(let j=0;j<this.#height;j++){
                currElevation = this.terain.array[i][j];
                currERatio = currElevation / this.#maxElevation;
                currColor = [baseColor[0] * currERatio,
                             baseColor[1] * currERatio,
                             baseColor[2] * currERatio]
                fill(...currColor);
                rect(i*DOWNSCALE,
                    j*DOWNSCALE,
                    DOWNSCALE,
                    DOWNSCALE);
            }
        }
    }

    generateCoastline(waterLine){
        // Just fills up to a waterline to start
        let currElevation, val;
        let maxWaterDepth = 0;
        for(let i=0;i<this.#width;i++){
            for(let j=0;j<this.#height;j++){
                currElevation = this.terain.array[i][j];
                if(currElevation < waterLine){
                    val = waterLine - currElevation; 
                    maxWaterDepth = max(maxWaterDepth,val);
                    this.water.array[i][j] = val;
                }
            }
        }
        // need to prevent divide by zero errors if no water depth
        this.#maxWaterDepth = maxWaterDepth != 0 ? maxWaterDepth : 1;
    }

    drawWater(baseColor = [255,255,255], ignoreDepth=false, overlay=false){
        let currDepth, currDRatio, currColor, alpha;
        if(overlay){
            this.drawTerain([255,255,255]);
            alpha = 255/2;
        }
        else{
            alpha = 255;
        }
        if(ignoreDepth){
            baseColor.push(alpha);
            for(let i=0;i<this.#width;i++){
                for(let j=0;j<this.#height;j++){
                    currDepth = this.water.array[i][j];
                    if(currDepth > 0){
                        fill(...baseColor);
                        rect(i*DOWNSCALE,
                            j*DOWNSCALE,
                            DOWNSCALE,
                            DOWNSCALE);
                    }
                }
            }
        }
        else{
            for(let i=0;i<this.#width;i++){
                for(let j=0;j<this.#height;j++){
                    currDepth = this.water.array[i][j];
                    if(currDepth > 0){
                        currDRatio = currDepth / this.#maxWaterDepth;
                        currColor = [baseColor[0] * currDRatio,
                                    baseColor[1] * currDRatio,
                                    baseColor[2] * currDRatio,
                                    alpha];
                        fill(...currColor);
                        rect(i*DOWNSCALE,
                            j*DOWNSCALE,
                            DOWNSCALE,
                            DOWNSCALE);
                    }
                }
            }
        }
    }
}

let scene, inpOctaves, inpScaling, inpNoiseStrength, inpOceanDepth,
    inpOctavesTxt;

function deltaInit(octaves, scaling, noiseStrength, oceanDepth){
    scene = new DeltaScene(CANVASWIDTH/DOWNSCALE, CANVASHEIGHT/DOWNSCALE);
    scene.generateTerain(ELEVATIONRESOLUTION,
                         octaves,
                         scaling,
                         noiseStrength);
    scene.generateCoastline(oceanDepth);
}

let t1, t2;

function setup() {

    // canvas setup
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    noStroke();
    t1=100;
    background(t1);

    // wait to animate at first
    noLoop();

    // create input boxes
    inpOctaves = createInput("4", "range");
    inpOctaves.elt.min = 1;
    inpOctaves.elt.max = 10;
    inpOctaves.position(0,CANVASHEIGHT+100);
    inpOctavesTxt = createDiv(inpOctaves.value().toString());
    inpOctavesTxt.position(200,CANVASHEIGHT+100)
    inpOctavesTxt.style.color = "white";
    inpOctaves.elt.oninput = function(){
        inpOctavesTxt.innerHTML = inpOctaves.value();
    }
}

function draw() {
    // create scene and generate terain
    /*deltaInit(4, 0.5, 0.2, 0.2);
    t1 = performance.now();
    background(0);
    scene.drawWater([0,0,255], ignoreDepth=true, overlay=true);
    t2 = performance.now();
    console.log("Time to draw scene:", (t2-t1)/1000, "seconds");
    fill(255);*/
}

// move forward one frame on click
function mouseClicked(){
    t1+=10;
    background(t1);
    console.log(inpOctaves.value());
    redraw();
    /*if(isLooping()){
        noLoop();
    } 
    else{
        loop();
    }*/
}