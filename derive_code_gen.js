function get_sized_pipeline(degree) {
    //generate projection to fill in null coefficients with 0
    var nullproj = {$project: {_id: 1}};
    var newx = {};
    for(var i = 0; i <= degree; i++) {
        newx[i] = {$ifNull: ["$x." + i, 0]};
    }
    nullproj["$project"]["x"] = newx;

    //generate projection to do actual derivation
    var deriveproj = {$project: {_id: 1}};
    var xprime = {};
    for(var i = 0; i < degree; i++) {
        xprime[i] = {$multiply: ["$x." + (1 + i), (1 + i)]};
    }
    deriveproj["$project"]["xprime"] = xprime;

    //return pipeline
    return [nullproj, deriveproj];
}

//test usage
var pl = get_sized_pipeline(4);
db.t.drop();
db.t.insert({_id: 0, x: {3: 2,       1: 6, 0: 5}});
db.t.insert({_id: 1, x: {3: 1, 2: 2, 1: 3, 0: 4}});
db.t.insert({_id: 2, x: {4: 1}});
var res = db.t.aggregate(pl).toArray();
printjson(res);
