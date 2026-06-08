class Terrain{
    #array;
    #width;
    #height;
    #maxElevation;
    #elevationResolution;
    #octaves;
    #scaling;
    #wOffset;
    #hOffset;

    constructor(width, height, maxElevation, elevationResolution, 
                octaves, scaling){
        this.#width = width;
        this.#height = height;
        this.#maxElevation = maxElevation;
        this.#elevationResolution = elevationResolution;
        this.#octaves = octaves;
        this.#scaling = scaling;

        this.#wOffset = this.#width * 10;
        this.#hOffset = this.#height * 10;
        
        this.#array = new NDArray(this.#width, this.#height);

        for(let i=0;i<this.#width;i++){
            for(let j=0;j<this.#height;j++){
                this.#linearGradient(i,j);
                for(let k=0;k<this.#octaves;k++){
                    this.#noiseOctave(i,j,k);
                }
            }
        }

        return this.#array;
    }

    #linearGradient(i, j){
        // linear gradient from top to bottom at pos [i][j]
        this.#array[i][j] = 1 - (j/this.#height);
    }

    #noiseOctave(i, j, octave){
        // apply a noise octave to the array at pos [i][j]
        let i_offset_scaled = (i + (octave * this.#wOffset)) 
                                * this.#elevationResolution;
        let j_offset_scaled = (j + (octave * this.#hOffset)) 
                                * this.#elevationResolution;
        let amplitude = octave == 0 ? 1 : this.#scaling / octave;
        let addedNoise = amplitude * (noise(i_offset_scaled,j_offset_scaled));

        this.#array[i][j] += addedNoise;
        this.#array[i][j] /= 1 + amplitude;
    }
}


// some global params
const CANVASWIDTH = 600;
const CANVASHEIGHT = 400;
const DOWNSCALE = 5;
const MAXELEVATION = 255;
const ELEVATIONRESOLUTION = 0.1;
let elevation;

function setup() {

    // canvas setup
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    noStroke();

    // wait for click to animate
    noLoop();

    // create elevation field
   elevation = new Terrain(CANVASWIDTH/DOWNSCALE,
                           CANVASHEIGHT/DOWNSCALE,
                           MAXELEVATION,
                           ELEVATIONRESOLUTION,
                           5,
                           0.9
   );
}

function draw() {
    for(let i=0;i<elevation.length;i++){
        for(let j=0;j<elevation[i].length;j++){
            fill(elevation[i][j]*MAXELEVATION);
            rect(i*DOWNSCALE,
                 j*DOWNSCALE,
                 DOWNSCALE,
                 DOWNSCALE);
        }
    }
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