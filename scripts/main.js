const categories = [
    "Products",
    "Services",
    "Food",
    "Household",
    "Leisure",
    "Housing",
    "Luxury"
];
const vizDivId = "viz-div";
const fileLocation = "https://raw.githubusercontent.com/6859-sp21/a4-akshit-lucas-moises/main/datafile.csv";

// FUNCTION: SHOW VISUALIZATION
const showVis = function(cssClass, vizData) {
    d3.selectAll(`.${cssClass}`).remove()
    SunBurst(vizData, cssClass)
}

// MAIN
var vizDivWidth = d3.select(`#${vizDivId}`).node().getBoundingClientRect().width;
const vizDivCenter = vizDivWidth / 2;
let pieRadius = vizDivWidth / 3;
let pieInnerRadius = pieRadius * 0.4;

var userInput = getEmptyCategoriesWithValuesObj(categories);
generateUserControls(userInput);

var colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeDark2);
var pieChart = PieChart(getObjValuesAsArray(userInput, categories), vizDivId, vizDivCenter);

var consumptionVizData = {};
d3.csv(fileLocation).then(
    (data) => {
        consumptionVizData = csv2JSON(data, categories);
        d3.select("button").style("display", "block");
    }, 
    (error) => { console.error(error); }
);