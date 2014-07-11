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

function Re( c ) {
    return "$" + c + ".Complex.re";
}

function Im( c ) {
    return "$" + c + ".Complex.im";
}

function Add() {
    return [
        { "$project": {
            _id: 0,
            a  : 1,
            b  : 1,
            sum: {
                Complex: {
                    re: {
                        "$add": [
                            Re( "a" ),
                            Re( "b" )
                        ]
                    },
                    im: {
                        "$add": [
                            Im( "a" ),
                            Im( "b" )
                        ]
                    }
                }
            }
        } }
    ];
}

function Subtract() {
    return [
        { "$project": {
            _id: 0,
            a  : 1,
            b  : 1,
            difference: {
                Complex: {
                    re: {
                        "$subtract": [
                            Re( "a" ),
                            Re( "b" )
                        ]
                    },
                    im: {
                        "$subtract": [
                            Im( "a" ),
                            Im( "b" )
                        ]
                    }
                }
            }
        } }
    ];
}

function Multiply() {
    return [
        { "$project": {
            _id: 0,
            a  : 1,
            b  : 1,
            product: {
                Complex: {
                    re: {
                        "$subtract": [
                            {
                                "$multiply": [
                                    Re( "a" ),
                                    Re( "b" )
                                ]
                            },
                            {
                                "$multiply": [
                                    Im( "a" ),
                                    Im( "b" ),
                                ]
                            }
                        ]
                    },
                    im: {
                        "$add": [
                            {
                                "$multiply": [
                                    Re( "a" ),
                                    Im( "b" )
                                ]
                            },
                            {
                                "$multiply": [
                                    Im( "a" ),
                                    Re( "b" )
                                ]
                            }
                        ]
                    }
                }
            }
        } }
    ];
}
