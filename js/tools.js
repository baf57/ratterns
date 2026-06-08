class NDArray{
    constructor(...dims){
        /* Create ND array recursively based on dims */
        function newDim(_i,){
            if(_i == (dims.length - 1)){
                // base case
                return new Array(dims[_i]).fill(0);
            }
            
            // recurse case
            let _array = new Array(dims[_i]);
            for(let i=0; i<dims[_i]; i++){
                _array[i] = newDim(_i+1);
            }
            return _array;
        }

        let array = newDim(0);

        return array;
    }
}
