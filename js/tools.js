class NDArray{
    array;
    #dims;

    constructor(fillValue, ...dims){
        /* Create ND array recursively based on dims */
        // ISSUE: this returns and array not an NDArray ??

        this.#dims = dims;
        this.array = this.#newDim(0, this.#dims, fillValue);
    }

    get dims(){
        return this.#dims;
    }

    newLike(fillValue){
        return new NDArray(fillValue, ...this.#dims);
    }

    #newDim(_i, dims, fillValue){
        if(_i == (dims.length - 1)){
            // base case
            return new Array(dims[_i]).fill(fillValue);
        }
        
        // recurse case
        let _array = new Array(dims[_i]);
        for(let i=0; i<dims[_i]; i++){
            _array[i] = this.#newDim(_i+1,dims,fillValue);
        }
        return _array;
    }
}
