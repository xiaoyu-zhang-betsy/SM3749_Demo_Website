const data = [
    { year: 2021, type: "games", count: 2 },
    { year: 2021, type: "paintings", count: 6 },
    { year: 2021, type: "blog posts", count: 8 },
    { year: 2022, type: "paintings", count: 8 },
    { year: 2022, type: "blog posts", count: 10 },
    { year: 2023, type: "games", count: 1 },
    { year: 2023, type: "blog posts", count: 12 },
    { year: 2024, type: "blog posts", count: 5 },
];

// Define dimensions and margins
const margin = { top: 20, right: 30, bottom: 50, left: 120 }; // Increased left margin
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#vis-scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define scales
const startYear = 2020;
const endYear = 2025;
const x = d3.scaleLinear()
    .domain([startYear, endYear]) // Set the domain to 2020-2025
    .range([0, width]);

const y = d3.scaleBand()
    .domain([...new Set(data.map(d => d.type))]) // Unique types of work
    .range([0, height])
    .padding(0.1); // Reduced padding

const radiusScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([5, 20]);

// Create axes
const xAxis = d3.axisBottom(x)
    .tickFormat(d3.format("d")) // Format x-axis ticks as integers
    .tickValues(d3.range(startYear, endYear + 1)); // Explicitly set the tick values to the range of years

svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .attr("class", "axis");

const yAxis = d3.axisLeft(y);
svg.append("g")
    .attr("class", "axis y-axis-labels") // Added a class for styling
    .call(yAxis);

// Create tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// Create circles
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.type) + y.bandwidth() / 2)
    .attr("r", d => radiusScale(d.count))
    .style("fill", "steelblue")
    .style("opacity", 0.7)
    .on("mouseover", function(event, d) {
        tooltip.style("display", "block")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px")
            .html(`Year: ${d.year}<br>Type: ${d.type}<br>Count: ${d.count}`);
    })
    .on("mouseout", function() {
        tooltip.style("display", "none");
    });

// Add axis labels
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .style("text-anchor", "middle")
    .text("Year");

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 15)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .text("Type of Work");