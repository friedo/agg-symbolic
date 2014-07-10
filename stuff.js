function Complex( re, im ) {
    return { Complex: { re: re, im: im } }
}

function Rational( n, d ) {
    return { Rational: { n: n, d: d } };
}

function Real( n ) {
    return Complex( n, 0 );
}

function Imaginary( n ) {
    return Complex( 0, n );
}

function Add() {
    return [
        { "$project": { _id: 0, "re": "$Complex.re", "im": "$Complex.im" } },
        { "$group": { _id: 1, re: { "$sum": "$re"}, im: { "$sum": "$im" } } },
        { "$project": { "Complex": { re: "$re", im: "$im" } } }
    ];
}

function Subtract() {

}
