/** DATA */
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

/** UI */
// GENERATE USER CONTROLS
const generateUserControls = function() {
    
    const inputsDiv = d3.select("#user-input");
    
    var userInputHtml = "";
    for (var i=0; i<categories.length; i++) {
        userInputHtml += `<div>`;
        userInputHtml += `<label for="${categories[i]}" class="label">`;
        userInputHtml += `${categories[i]} = <span id="${categories[i]}-value">...</span>  %`;
        userInputHtml += `</label>`;
        userInputHtml += `<input type="range" min="0" max="100" id="${categories[i]}">`;
        userInputHtml += `</div>`;
    }
    inputsDiv.html(userInputHtml);
}

// CLICK LISTENER
const sliderInputListener = function(categoryName, value) {
    leftInterraction.data[categoryName] = +value;
    leftInterraction.update();
}

// FUNCTION: SHOW VISUALIZATION
const showVis = function(cssClass, vizData) {
    d3.selectAll(`.${cssClass}`).remove()
    SunBurst(vizData, cssClass)
}

// LEFT INTERCTION
const LeftInterraction = () => {

    var that = {}
    
    // DATA MEMBERS
    that.hide = true;
    that.data = {};
    for (var i=0; i<categories.length; i++) {
        that.data[categories[i]] = 0;
    }

    // FUNCTIONS
    that._updateSliderText = function(labelId, sliderId, value) {
        d3.select(`#${labelId}`).text(value);
        d3.select(`#${sliderId}`).property("value", value);
    };

    that.update = () => {

        // adjust the text on the range slider, and
        // sum all values
        var sum = 0;
        for (var i=0; i<categories.length; i++) {
            that._updateSliderText(`${categories[i]}-value`, `${categories[i]}`, that.data[categories[i]]);
            sum += that.data[categories[i]];
        }

        // change message based on sum of values
        d3.select("#message").text(`Total Allocation = ${sum}%`);

        // Show/hide Visualization(s)
        if (sum == 100){
            that.hide = false;
            for (var i=0; i<categories.length; i++) {
                d3.select(`#${categories[i]}`).attr("disabled", true);
            }
        } else {
            that.hide = true;
        }

        
        if(!that.hide) {
            showVis('user-viz', that.getUserData());
            showVis('country-viz', consumptionVizData);
        }
    }

    that.getUserData = () => {

        var dataObj = getEmptyDataObj();
        for (var i=0; i<dataObj.children.length; i++) {
            
            var categoryName = dataObj.children[i].name;
            dataObj.children[i].value = that.data[categoryName];
        }
        return dataObj;
    }

    return that;
}

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
    width = 700
    r = width / 7
    arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(r * 1.5)
        .innerRadius(d => d.y0 * r)
        .outerRadius(d => Math.max(d.y0 * r, d.y1 * r - 1))
    
    const root = partition(data);
    root.each(d => d.current = d);

    if ( name == 'user-viz') {
        d3.select("#right")
            .append("h1")
            .style('margin-left', '32px')
            .text('Your expenditure style')
    }
    if ( name == 'country-viz') {
        d3.select("#right")
            .append("h1")
            .style('margin-left', '32px')
            .text('Expenditure Data of the Indian Poor*')
    }
    

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

// MAIN
generateUserControls();
for (var i=0; i<categories.length; i++) {
    d3.select(`#${categories[i]}`).on("input", function() {
        sliderInputListener(this.id, +this.value);
    })
}

var leftInterraction = LeftInterraction()

d3.csv("datafile.csv").then(
    (data) => {
        consumptionVizData = csv2JSON(data);
        leftInterraction.update();
    }, 
    (error) => {
        console.error(`LOAD_FILE_ERROR: ${error}`)
    }
);