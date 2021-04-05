

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
        (data) => {
            consumptionData = csv2JSON(data);
        }, 
        (error) => {console.error("LOAD_FILE_ERROR")});

// LEFT INTERCTION
const LeftInterraction = () => {

    that = {}

    // category variables
    that.food = 0
    that.leisure = 0
    that.household = 0
    that.services = 0
    that.housing = 0
    that.taxes = 0
    that.luxury = 0
    that.products = 0
    that.consumptionData = {}
    
    that.hide = true

    that.update = () => {
        // adjust the text on the range slider
        d3.select("#Food-value").text(that.food);
        d3.select("#Food").property("value", that.food);

        d3.select("#Leisure-value").text(that.leisure);
        d3.select("#Leisure").property("value", that.leisure);

        d3.select("#Household-value").text(that.household);
        d3.select("#Household").property("value", that.household);

        d3.select("#Services-value").text(that.services);
        d3.select("#Services").property("value", that.services);

        d3.select("#Housing-value").text(that.housing);
        d3.select("#Housing").property("value", that.housing);

        d3.select("#Taxes-value").text(that.taxes);
        d3.select("#Taxes").property("value", that.taxes);

        d3.select("#Luxury-value").text(that.luxury);
        d3.select("#Luxury").property("value", that.luxury);

        d3.select("#Products-value").text(that.products);
        d3.select("#Products").property("value", that.products);


        let sum = that.food + that.leisure + that.household + that.services + that.housing + that.taxes + that.luxury + that.products

        // change message based on sum of values
        if (sum == 100){
            d3.select("#message").text('Values add to 100% !');
            d3.select("#message").property("value", 'Values add to 100% !');
            if (that.hide) {
                that.showUserVis();
                that.showCountryVis();
                that.hide = false
            }
        }
        else if(sum > 100){
            d3.select("#message").text(`Values are > 100%, ${sum}%`);
            d3.select("#message").property("value", `Values are > 100%, ${sum}%`);
        }
        else if(sum < 100){
            d3.select("#message").text(`Values are < 100%, ${sum}%`);
            d3.select("#message").property("value", `Values are < 100%, ${sum}%`);
        }

        if (!that.hide) {
            that.updateUserVis();
        }
    }

    that.getUserData = () => {
        var dataObj = { "name": "root", "children": []};
        for (var i=0; i<categories.length; i++) {
            categoryName = categories[i];
            categoryData = categoryName.toLowerCase()
            if (categoryName == 'Taxes & Fees'){
                categoryData = 'taxes'
            }
            dataObj.children.push({
                "name": categoryName,
                "value": that[categoryData]
            });
        }
        return dataObj;
    }

    that.showUserVis = () => {

        let userData = that.getUserData()
        d3.select("#right")
            .append("pre")
            .attr("id", 'user-viz')
            .text(JSON.stringify(userData, null, 1));

    }
    that.updateUserVis = () => {
        let userData = that.getUserData()
        d3.select("#user-viz")
            .text(JSON.stringify(userData, null, 1));
    }

    that.showCountryVis = () => {

        d3.select("#right")
            .append("pre")
            .attr("id", 'country-viz')
            .text(JSON.stringify(consumptionData, null, 1))
            .style('width: 40vw;');

    }

    return that
}

var leftInterraction = LeftInterraction()

// click listeners
d3.select("#Food").on("input", function() {
    leftInterraction.food = +this.value
    leftInterraction.update()
});

d3.select("#Leisure").on("input", function() {
    leftInterraction.leisure = +this.value
    leftInterraction.update()
});

d3.select("#Household").on("input", function() {
    leftInterraction.household = +this.value
    leftInterraction.update()
});

d3.select("#Services").on("input", function() {
    leftInterraction.services = +this.value
    leftInterraction.update()
});

d3.select("#Housing").on("input", function() {
    leftInterraction.housing = +this.value
    leftInterraction.update()
});

d3.select("#Taxes").on("input", function() {
    leftInterraction.taxes = +this.value
    leftInterraction.update()
});

d3.select("#Luxury").on("input", function() {
    leftInterraction.luxury = +this.value
    leftInterraction.update()
});

d3.select("#Products").on("input", function() {
    leftInterraction.products = +this.value
    leftInterraction.update()
});


leftInterraction.update();


