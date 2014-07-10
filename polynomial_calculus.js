function get_sized_derive_pipeline(degree) {
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
    deriveproj["$project"]["x"] = xprime;

    //return pipeline
    return [nullproj, deriveproj];
}

function get_sized_integrate_pipeline(degree) {
    //generate projection to fill in null coefficients with 0
    var nullproj = {$project: {_id: 1}};
    var newx = {};
    for(var i = 0; i <= degree + 1; i++) {
        newx[i] = {$ifNull: ["$x." + i, 0]};
    }
    nullproj["$project"]["x"] = newx;

    //generate projection to do actual derivation
    var integrateproj = {$project: {_id: 1}};
    var xint = {};
    for(var i = 0; i <= degree + 1; i++) {
        if(i === 0) {
            xint[i] = {$multiply: [1, 0]};//need to set it to 0 somehow lol
        } else {
            xint[i] = {$divide: ["$x." + (i - 1), i]};
        }
    }
    integrateproj["$project"]["x"] = xint;

    //return pipeline
    return [nullproj, integrateproj];
}

//test usage
var ipl = get_sized_integrate_pipeline(5);
var dpl = get_sized_derive_pipeline(5);
//derive then integrate, should return to original doc
for(k in ipl) {
    dpl.push(ipl[k]);
}
db.t.drop();
db.t.insert({_id: 3, x: {5: 6, 4: 5, 3: 4, 2: 3, 1: 2, 0: 1}});
var res = db.t.aggregate(dpl).toArray();
printjson(res);
