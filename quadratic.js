// numeric square roots courtesy John Page
// (http://ilearnasigoalong.blogspot.com/2014/05/the-case-of-missing-operator-how-to-use.html)

function Newton() {
    var init    = { $project : { n: 1, min_b: 1, two_a: 1, r : { $literal : 1}}};
    var refine  = { $project : { n: 1, min_b: 1, two_a: 1, r : { $divide : [ {$add : [{$divide : [ "$n","$r"]} , "$r" ]},2]}}};
    return [
        init, refine, refine, refine, refine, refine, refine, refine, refine
    ]
}

function Quadratic() {
    var pipe = [
        { $project : {
            _id:   0,
            a: "$quadratic.a",
            b: "$quadratic.b",
            c: "$quadratic.c",
            min_b: { "$subtract" : [ 0, "$quadratic.b" ] },
            two_a: { "$multiply" : [ 2, "$quadratic.a" ] },
            four_a_c: { "$multiply" : [ 4, "$quadratic.a", "$quadratic.c" ] },
            b_sq: { "$multiply" : [ "$quadratic.b", "$quadratic.b" ] }
        } },
        { $project: {
            min_b: 1,
            two_a: 1,
            n: { "$subtract": [ "$b_sq", "$four_a_c" ] }
        } },
    ];

    pipe = pipe.concat(Newton());

    rest = [
        { $project: {
            x1: { "$divide": [ { "$add":      [ "$min_b", "$r" ] }, "$two_a" ] },
            x2: { "$divide": [ { "$subtract": [ "$min_b", "$r" ] }, "$two_a" ] }
        } }
    ];

    pipe = pipe.concat( rest );

    return pipe;
}
