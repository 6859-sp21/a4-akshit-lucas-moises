// FUNCTION: GENERATE CATEGORY-VALUE OBJECT
const getEmptyCategoriesWithValuesObj = function(categories) {
    var dataObj = {};
    for (var i=0; i<categories.length; i++) {
        dataObj[categories[i]] = 100 / categories.length;
    }
    return dataObj;
}

// FUNCTION: SET INITIAL (NULL) VALUES FOR DATA OBJECTS
const getEmptyDataVizObj = function(categories) {
    var dataObj = { "name": "root", "children": []};
    for (var i=0; i<categories.length; i++) {
        categoryName = categories[i];
        dataObj.children.push({
            "name": categoryName,
            "children": [],
            "value": 0
        });
    }
    return dataObj;
}

// FUNCTION: FORMAT DATA
const csv2JSON = function(data, categories){
    var jsonData = getEmptyDataVizObj(categories);
    for (var i=0; i<data.length; i++) {

        var name = data[i]["variable"];
        var value = data[i]["mean"];
        var parent1 = data[i]["category_1"];
        // var parent2 = data[i]["category_2"];

        var dataObj = {
            "name": name,
            "value" :  value
        };

        for (var j=0; j<jsonData.children.length; j++) {
            var category = jsonData.children[j];
            var categoryName = category.name;
            if (categoryName === parent1) {
                category.children.push(dataObj);
                break;
            }
        }
    }
    return jsonData;
}

// FUNCTION: CONVERT OBJECT TO VALUES-ONLY ARRAY
const getObjValuesAsArray = function(obj, keysOrder) {
    var arr = [];
    for (var i=0; i<keysOrder.length; i++) {
        var key = keysOrder[i];
        arr.push(obj[key]);
    }
    return arr;
}