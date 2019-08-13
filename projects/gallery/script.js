$(function () {
    const versions = {
        PROTOTYPE() {},

        ES5() {},

        ES6() {},

        RAW() {

        },
    };

    versions.RAW();
});


function handler(funk, arr) {
    let newArr =[];
     for (let i = 0; i < arr.length; i++ ){
         newArr.push(funk(arr[i]));
     }
    console.log(newArr)
    map
}

function f(a) {
    return a*10
}

let arr =  [1,2,3,4,5,6];

function fmap(funkA, funkB) {
        console.log(funkA(funkB))
}

let z = 0;

let a = (step) => {
    z += step;
    return z
};
let b = (x) => {
    return x * 2};
