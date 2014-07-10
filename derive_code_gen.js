function get_sized_pipeline(degree) {
    var project = {$project: {_id: 1}};
    var xpdoc = {};
    for(var i = 0; i < degree; i++) {
        xpdoc[i] = {$multiply: ["$x." + (1 + i), (1 + i)]};
    }
    project["$project"]["xprime"] = xpdoc;
    return [project];
}

//test usage
var pl = get_sized_pipeline(3);
db.t.drop();
db.t.insert({_id: 0, x: {3: 2, 2: 3, 1: 6, 0: 5}});
db.t.insert({_id: 1, x: {3: 1, 2: 2, 1: 3, 0: 4}});
var res = db.t.aggregate(pl).toArray();
printjson(res);
