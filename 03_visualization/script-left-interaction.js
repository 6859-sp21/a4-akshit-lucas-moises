var width = 600;
var height = 600;
 
var holder = d3.select("body")
      .append("svg")
      .attr("width", width)    
      .attr("height", height); 

// draw the circle
holder.append("circle")
  .attr("cx", 150)
  .attr("cy", 450) 
  .style("fill", "none")   
  .style("stroke", "blue") 
  .attr("r", 90);

// when the input range changes update the circle 
d3.select("#category_1").on("input", function() {
  update(+this.value);
});

// Initial starting radius of the circle 
update(90);

// update the elements
function update(nRadius) {

  // adjust the text on the range slider
  d3.select("#category_1-value").text(nRadius);
  d3.select("#category_1").property("value", nRadius);

  // update the circle radius
  holder.selectAll("circle") 
    .attr("r", nRadius);
}



