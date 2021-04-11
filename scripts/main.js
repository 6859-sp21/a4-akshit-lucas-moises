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
const vizDivId = "viz-div";
const fileLocation = "../datafile.csv";

// FUNCTION: SHOW VISUALIZATION
const showVis = function(cssClass, vizData) {
    d3.selectAll(`.${cssClass}`).remove()
    SunBurst(vizData, cssClass)
}

// MAIN
var vizDivWidth = d3.select(`#${vizDivId}`).node().getBoundingClientRect().width;
const vizDivCenter = vizDivWidth / 2;
const pieRadius = vizDivWidth / 8;

var userInput = getEmptyCategoriesWithValuesObj(categories);
generateUserControls(userInput);

var colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeDark2);
var pieChart = PieChart(getObjValuesAsArray(userInput, categories), vizDivId, vizDivCenter, colorScale);

var consumptionVizData = {};
d3.csv(fileLocation).then(
    (data) => {
        consumptionVizData = csv2JSON(data, categories);
        d3.select("button").style("display", "block");
    }, 
    (error) => { console.error(error); }
);