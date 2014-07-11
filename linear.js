function Linear() {
    return [
        { "$project": {
            _id: 0,
            a: "$linear.a",
            b: "$linear.b",
            min_b: {
                "$subtract": [ 0, "$linear.b" ]
            }
        } },
        { "$project": {
            x: {
                "$divide" : [ "$min_b", "$a" ]
            }
        } }
    ];
}
