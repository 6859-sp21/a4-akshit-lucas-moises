// PIE CHART
const PieChart = (initialData, divId, vizDivCenter, colorScale) => {

    const that = this;
    that.vizDivCenter = vizDivCenter;
    that.colorScale = colorScale;

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
            .innerRadius(0)
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
			.attr("fill", (d, i) => { return that.colorScale(i); })
			.attr("d", arc);
    }

    update(initialData);

    return that;
}
