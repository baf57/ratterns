// some global params
const CANVASWIDTH = 600;
const CANVASHEIGHT = 400;
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

    #applyNoise(i, j, elevationResolution, val=-1){
        // apply a noise octave to the array at pos (i,j)
        let i_scaled = i * elevationResolution;
        let j_scaled = j * elevationResolution;

        let addedNoise = noise(i_scaled,j_scaled);

        val = val<0 ? addedNoise : (val + addedNoise)/2;

        return val
    }

    generateTerain(elevationResolution, octaves, scaling){
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
                                        this.#linearGradient(i,j));
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

    generateWater(waterLine){
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

    drawWater(baseColor = [255,255,255], overlay=false){
        let currDepth, currDRatio, currColor, alpha;
        if(overlay){
            this.drawTerain([255,255,255]);
            alpha = 255/2;
        }
        else{
            alpha = 255;
        }
        for(let i=0;i<this.#width;i++){
            for(let j=0;j<this.#height;j++){
                currDepth = this.water.array[i][j];
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

let scene, wDepth;

function setup() {

    // canvas setup
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    noStroke();

    // wait for click to animate
    noLoop();

    // create scene and generate terain
    scene = new DeltaScene(CANVASWIDTH/DOWNSCALE, CANVASHEIGHT/DOWNSCALE);
    scene.generateTerain(ELEVATIONRESOLUTION,
                         4,
                         0.5);

    // for seeing reasonable water depths
    wDepth = 0;
}

function draw() {
    console.log("wDepth:",wDepth);
    scene.generateWater(wDepth);
    scene.drawWater([0,0,255]);//, true);
    wDepth += 0.1;
}

// move forward one frame on click
function mouseClicked(){
    redraw();
    /*if(isLooping()){
        noLoop();
    } 
    else{
        loop();
    }*/
}