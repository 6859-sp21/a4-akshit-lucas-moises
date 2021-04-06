

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
var height = 1000;

// SUNBURST GRAPH
const SunBurst = (data, name) => {
    partition = (data) => {
      const root = d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);
      return d3.partition()
          .size([2 * Math.PI, root.height + 1])
        (root);
    }
    
    color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
    format = d3.format(",d")
    width = 200
    r = width / 5
    arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(r * 1.5)
        .innerRadius(d => d.y0 * r)
        .outerRadius(d => Math.max(d.y0 * r, d.y1 * r - 1))
    
    const root = partition(data);
    root.each(d => d.current = d);

    const svg = d3.select("#right")
        .append("svg")
        .attr("viewBox", [0, 0, width, width])
        .attr('class', name)
        .style("font", "10px sans-serif");
  
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);
  
    const path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));
  
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);
  
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
  
    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);
  
    const parent = g.append("circle")
        .datum(root)
        .attr("r", r)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);
  
    function clicked(event, p) {
      parent.datum(p.parent || root);
  
      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });
  
      const t = g.transition().duration(750);
  
      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));
  
      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
    }
    
    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
  
    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }
  
    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * r;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  
    return svg.node();

}

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
            if (that.hide) {
                that.showUserVis();
                that.showCountryVis();
                that.hide = false
            }
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
        SunBurst(userData, 'user-viz')

    }
    that.updateUserVis = () => {
        let userData = that.getUserData()
        d3.selectAll('.user-viz').remove()
        SunBurst(userData, 'user-viz')
    }

    that.showCountryVis = () => {

        // TODO consumption data seems to be empty
        console.log(JSON.stringify(consumptionData))
        // SunBurst(consumptionData, 'country-viz')

        // placeholder
        let userData = that.getUserData()
        SunBurst(userData, 'country-viz')

    }

    return that
}



var leftInterraction = LeftInterraction()

// CLICK LISTENERS
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





