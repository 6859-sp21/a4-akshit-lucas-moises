// GLOBAL VARIABLES
const categories = [
    "Food",
    "Leisure",
    "Household",
    "Services",
    "Housing",
    "Taxes-Fees",
    "Luxury",
    "Products"
];
var consumptionVizData = {};

// FUNCTION: SET INITIAL (NULL) VALUES FOR DATA OBJECTS
const getEmptyDataObj = function() {
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
const csv2JSON = function(data){
    var jsonData = getEmptyDataObj();
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

// FUNCTION: SHOW VISUALIZATION
const showVis = function(cssClass, vizData) {
    d3.selectAll(`.${cssClass}`).remove()
    SunBurst(vizData, cssClass)
}

// MAIN
generateUserControls();
for (var i=0; i<categories.length; i++) {
    d3.select(`#${categories[i]}`).on("input", function() {
        sliderInputListener(this.id, +this.value);
    })
}

var leftInterraction = LeftInterraction();
var pieChart = PieChart("user-viz-div");

d3.csv("../datafile.csv").then(
    (data) => {
        consumptionVizData = csv2JSON(data);
        leftInterraction.update();
    }, 
    (error) => {
        console.error(`LOAD_FILE_ERROR: ${error}`)
    }
);