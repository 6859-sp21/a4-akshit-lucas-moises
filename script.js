// GLOBAL VARIABLES
const categories = [
    "Food",
    "Leisure",
    "Household",
    "Services",
    "Housing",
    "Taxes & Fees",
    "Luxury",
    "Products"
];
var userInputData = {};
var consumptionData = {};
var width = 1000;
var height = 600;
const radius = 100;

// SET INITIAL (NULL) VALUES FOR DATA OBJECTS
const getEmptyDataObj = function() {
    var dataObj = { "name": "root", "children": []};
    for (var i=0; i<categories.length; i++) {
        categoryName = categories[i];
        dataObj.children.push({
            "name": categoryName,
            "children": [],
            "value": null
        });
    }
    return dataObj;
}
userInputData = getEmptyDataObj();

// LOAD + FORMAT DATA
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
const loadFile = function(filename) {
    return new Promise(function(resolve, reject) {
        d3.csv(filename, function(data) {
            if (data) { 
                resolve(data);
            }
            else reject();
        });
    });
}
loadFile("datafile.csv")
    .then(
        (data) => {consumptionData = csv2JSON(data);}, 
        (error) => {console.error("LOAD_FILE_ERROR")});

// LEFT INTERCTION
const LeftInterraction = () => {

    that = {}

    // category variables
    that.food = 0
    that.consumables = 0
    that.leisure = 0
    
    that.hide = true

    that.update = () => {
        // adjust the text on the range slider
        d3.select("#food-value").text(that.food);
        d3.select("#food").property("value", that.food);

        d3.select("#consumables-value").text(that.consumables);
        d3.select("#consumables").property("value", that.consumables);

        d3.select("#leisure-value").text(that.leisure);
        d3.select("#leisure").property("value", that.leisure);

        // change message based on sum of values
        if (that.food + that.consumables + that.leisure == 100){
            d3.select("#message").text('Values add to 100% !');
            d3.select("#message").property("value", 'Values add to 100% !');
            if (that.hide) {
                that.showUserVis();
                that.showCountryVis();
                that.hide = false
            }
        }
        else if(that.food + that.consumables + that.leisure > 100){
            d3.select("#message").text('Values are > 100% !');
            d3.select("#message").property("value", 'Values are > 100% !');
        }
        else if(that.food + that.consumables + that.leisure < 100){
            d3.select("#message").text('Values are < 100% !');
            d3.select("#message").property("value", 'Values are < 100% !');
        }

        if (!that.hide) {
            that.updateUserVis();
            that.updateCountryVis();
        }
    }

    that.showUserVis = () => {
        d3.select("#right")
            .append("p")
            .attr("id", 'user-viz')
            .text(`User distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);

    }
    that.updateUserVis = () => {
        d3.select("#user-viz")
            .text(`User distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);
    }

    that.showCountryVis = () => {
        d3.select("#right")
            .append("p")
            .attr("id", 'country-viz')
            .text(`Country distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);

    }

    that.updateCountryVis = () => {
        d3.select("#country-viz")
            .text(`Country distribution will go here, Food: ${that.food}, Consumables: ${that.consumables}, Leisure: ${that.leisure}`);
    }

    return that
}

var leftInterraction = LeftInterraction()

// click listeners
d3.select("#food").on("input", function() {
    leftInterraction.food = +this.value
    leftInterraction.update()
});

d3.select("#leisure").on("input", function() {
    leftInterraction.leisure = +this.value
    leftInterraction.update()
});

d3.select("#consumables").on("input", function() {
    leftInterraction.consumables = +this.value
    leftInterraction.update()
});

leftInterraction.update();


