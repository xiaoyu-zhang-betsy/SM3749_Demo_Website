// Data for the radar plot
(function(){
    const data = [
        { skill: "Researcher", value: 0.85 },
        { skill: "Programmer", value: 0.8 },
        { skill: "ProblemSolving", value: 0.9 },
        { skill: "Leadership", value: 0.7 },
        { skill: "Communication", value: 0.7 },
        { skill: "Designer", value: 0.5 }
    ];

    // Configuration
    const margin = {top: 70, right: 70, bottom: 70, left: 70};
    const width = 700 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const levels = 5; // Number of concentric circles
    const maxValue = 1; // Maximum value for the data
    const labelFactor = 1.15;
    const angleSlice = Math.PI * 2 / data.length;
    const opacityArea = 0.35;
    const dotRadius = 4;

    // SVG setup
    const svg = d3.select("#vis-radarplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    // Scale for the radii
    const rScale = d3.scaleLinear()
        .range([0, width / 2])
        .domain([0, maxValue]);

    // Create the circular grid lines
    for (let j = 0; j < levels; j++) {
        const levelFactor = rScale(maxValue * ((j + 1) / levels));

        // Calculate coordinates for the polygon
        const coords = data.map((d, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return [levelFactor * Math.cos(angle), levelFactor * Math.sin(angle)];
        });

        // Draw straight lines connecting the coordinates
        svg.append("polygon")
            .attr("class", "grid-line")
            .attr("points", coords.map(point => point[0] + "," + point[1]).join(" "))
            .style("fill", "none")
            .style("stroke", "#777")
            .style("stroke-width", 0.3)
            .style("stroke-dasharray", "2,2")
            .style("fill-opacity", 0.1);
    }


    // Create the axes (lines radiating from the center)
    const axis = svg.selectAll(".axis")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "axis")
        .style("stroke", "#777")
        .style("stroke-width", "1px");

    // Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d.skill);

    // Transform data for polygon creation
    const radarLine = d3.line() // Changed to d3.line() for straight lines
        .curve(d3.curveLinearClosed) // Ensures the line is closed
        .x((d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .y((d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));


    // Draw the radar area
    svg.append("path")
        .datum(data)
        .attr("class", "radar-area")
        .attr("d", radarLine)
        .style("fill", "steelblue")
        .style("fill-opacity", 0.3)
        .style("stroke", "steelblue")
        .style("stroke-width", 2);

    // Add dots
    svg.selectAll(".radar-point")
        .data(data)
        .enter().append("circle")
        .attr("class", "radar-point")
        .attr("r", dotRadius)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", "steelblue")
        .style("fill-opacity", 0.8);
})();