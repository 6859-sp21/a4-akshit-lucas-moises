// PIE CHART
const PieChart = (initialData, divId, vizDivCenter) => {

    const that = this;
    that.vizDivCenter = vizDivCenter;

    // A function that create / update the plot for a given variable:
    that.update = (data) => {

        // CLEAR PREVIOUS CHART
        d3.select(`#${divId}`).html("");

        // CREATE SVG
        var svg = d3.select(`#${divId}`)
            .append("svg")
            .attr("width", 2 * pieRadius)
            .attr("height", 2 * pieRadius)
            .attr("transform", `translate(${vizDivCenter - pieRadius},${vizDivCenter - pieRadius})`);

        // CREATE GROUP ELEMENT
        var g = svg.append("g").attr("transform", `translate(${pieRadius},${pieRadius})`);


		// Generate the arcs
		var arc = d3.arc()
            .innerRadius(pieInnerRadius)
			.outerRadius(pieRadius);

        // CREATE DATA PACEHOLDER
        var pie = d3.pie();

		//Generate groups
		var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", (d, i) => { 
                return colorScale(i); 
            })
            .style("fill-opacity","0.6")
			.attr("d", arc);
        

        arcs.append("text")
            .attr("transform", function(d){
                      d.innerRadius = pieInnerRadius;
                      d.outerRadius = pieRadius;
                return "translate(" + arc.centroid(d) + ")";
              })
              .attr("text-anchor", "middle")
              .text( (d, i) => categories[i])
              .style("font-size", "12px");
    }

    update(initialData);

    return that;
}
