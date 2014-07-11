function get_sized_derive_pipeline(targetfield, outfield, degree) {
    //generate projection to fill in null coefficients with 0
    var nullproj = {$project: {_id: 1}};
    var newx = {};
    for(var i = 0; i <= degree; i++) {
        newx[i] = {$ifNull: ["$" + targetfield + "." + i, 0]};
    }
    nullproj["$project"][targetfield] = newx;

    //generate projection to do actual derivation
    var deriveproj = {$project: {_id: 1}};
    var xprime = {};
    for(var i = 0; i < degree; i++) {
        xprime[i] = {$multiply: ["$" + targetfield + "." + (1 + i), (1 + i)]};
    }
    deriveproj["$project"][outfield] = xprime;

    //return pipeline
    return [nullproj, deriveproj];
}

function get_sized_integrate_pipeline(targetfield, outfield, degree) {
    //generate projection to fill in null coefficients with 0
    var nullproj = {$project: {_id: 1}};
    var newx = {};
    for(var i = 0; i <= degree + 1; i++) {
        newx[i] = {$ifNull: ["$" + targetfield + "." + i, 0]};
    }
    nullproj["$project"][targetfield] = newx;

    //generate projection to do actual derivation
    var integrateproj = {$project: {_id: 1}};
    var xint = {};
    for(var i = 0; i <= degree + 1; i++) {
        if(i === 0) {
            xint[i] = {$multiply: [1, 0]};//need to set it to 0 somehow lol
        } else {
            xint[i] = {$divide: ["$" + targetfield + "." + (i - 1), i]};
        }
    }
    integrateproj["$project"][outfield] = xint;

    //return pipeline
    return [nullproj, integrateproj];
}

//TODO this needs work
function get_sum_pipeline(targetfields, outfield, degree) {
    //generate projection to fill in all null coefficients with 0
    var nullproj = {$project: {_id: 1}};
    for(var i = 0; i <= degree; i++) {
        for(var k = 0; k < targetfields.size(); k++) {
            nullproj["$project"][targetfields[k]][i] = 0;
        }
    }

    //generate projection to add all the fields
    var addproj = {$project: {_id: 1}};
    for(var i = 0; i <= degree; i++) {
        addproj["$project"][outfield][i] = {"$add": []};
        for(var k = 0; k < targetfields.size(); k++) {
            addproj["$project"][outfield][i]["$add"].push("$" + targetfields[k] + "." + i);
        }
    }
}

db.t.drop();
var idoc = {_id: 0, x: {5: 6, 4: 5, 3: 4, 2: 3, 1: 2, 0: 1}};
print("Initial polynomial:");
printjson(idoc);
print("Human readable format: 6x^5 + 5x^4 + 4x^3 + 3x^2 + 2x + 1");
db.t.insert(idoc);

//test usage
var ipl = get_sized_integrate_pipeline("x", "y", 5);
var res = db.t.aggregate(ipl).toArray();
print("Now lets integrate this polynomial!");
printjson(res);
print("Human readable result: x^6 + x^5 + x^4 + x^3 + x^2 + x + 0");
var dpl = get_sized_derive_pipeline("x", "y", 5);
res = db.t.aggregate(dpl).toArray();
print("Now lets derive this polynomial!");
printjson(res);
print("Human readable result: 30x^4 + 20x^3 + 12x^2 + 6x + 2");
