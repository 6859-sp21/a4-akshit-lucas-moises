// PIE CHART
const PieChart = (name) => {

    this.data = Array(categories.length).fill(100 / categories.length);

    this.svg = d3.select(`#${name}`)
        .append("svg")
        .attr("width", 2 * pieRadius)
        .attr("height", 2 * pieRadius)
        .append("g").attr("transform", `translate(${pieRadius},${pieRadius})`);

    // A function that create / update the plot for a given variable:
    this.update = () => {

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(categories)
            .range(d3.schemeDark2);

        var pie = d3.pie();

		// Generate the arcs
		var arc = d3.arc()
            .innerRadius(0)
			.outerRadius(pieRadius);

		//Generate groups
        console.log(this.data);
		var arcs = this.svg.selectAll("arc")
            .data(pie(this.data))
            .enter()
            .append("g")
            .attr("class", "arc")

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);
    }

    update();

    return this;
}
