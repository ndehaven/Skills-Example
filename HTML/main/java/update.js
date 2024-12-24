// Access dataset using d3 csv parsing tool
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the Win/Loss Ratio button
    const csvFilePath = 'src/main/data/Dataset.csv'; // Update with the actual CSV file path
    const winLossButton = document.getElementById('win-loss-ratio-btn');
    const filteredData = [];
    
    winLossButton.addEventListener('click', () => {
        // Clear and render the pie chart in both SVG panels
        createPieChart(csvFilePath, 'svg-panel-1', 1);
        createPieChart(csvFilePath, 'svg-panel-2', 0);
    });

});


function clearSvg(containerId) {
    const svg = d3.select(`#${containerId}`);
    svg.selectAll("*").remove();
    console.log("SVG loaded");
    return svg;
}

// Function to create the interactive pie chart
function createPieChart(csvFilePath, svgSelector, presence) {

    //clearSvg(svgSelector);

    d3.csv(csvFilePath).then((data) => {
        console.log("Raw Data Loaded from CSV:", data); // Log the raw data

        // Parse the necessary fields into numeric values
        data.forEach((d, i) => {
            d.Player_Presence = +d.Player_Presence;
            d.WIN = +d.WIN;
            d.STL = +d.STL;
            d.BLK = +d.BLK;
            d.PTS_ALLOWED = +d.PTS_ALLOWED;
            console.log(`Parsed Row ${i}:`, d); // Log each parsed row
        });

        // Filter games where Jimmy Butler was present and wasnt present
        if (presence === 1) {
            filteredData = data.filter(d => d.Player_Presence === 1);
        }
        else {
            filteredData = data.filter(d => d.Player_Presence === 0);
        }
        console.log("Filtered Data (Games Jimmy Played):", filteredData);

            // Aggregate data
        const aggregatedData = [
            {label: "Wins", value: filteredData.filter(d => d.WIN === 1).length},
            {label: "Losses", value: filteredData.filter(d => d.WIN === 0).length}
        ];

        //testing testing
        console.log("Aggregated Data (Wins/Losses):", aggregatedData);

        // Dimensions for the pie chart
        const width = 300;
        const height = 400;
        const radius = Math.min(width, height) / 2 - 20;

        console.log("Chart Dimensions: ", { width, height, radius });

        // Create an SVG container
        const svg = d3.select(`#${svgSelector}`)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);
        console.log("SVG Container Created.");

        // Create a pie layout and arc generator
        const pie = d3.pie()
            .value(d => d.value); // Use the aggregated win/loss values

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Define a color scale
        const color = d3.scaleOrdinal()
            .domain(aggregatedData.map(d => d.label))
            .range(["#4caf50", "#f44336"]); // Green for wins, red for losses
        console.log("Color Scale Created:", color.domain());

        // Create pie slices
        const slices = svg.selectAll('path')
            .data(pie(aggregatedData))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.label))
            .attr('stroke', '#fff')
            .attr('stroke-width', '2px')
            .on('mouseover', function (event, d) {
                console.log(`Mouse Over Slice: ${d.data.label} (${d.data.value} games)`);
                const tooltip = svg.append('text')
                    .attr('x', 0)
                    .attr('y', -radius - 20)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#333')
                    .attr('font-size', '14px')
                    .attr('id', 'tooltip')
                    .text(`${d.data.label}: ${d.data.value} games`);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', '2px');
                d3.select('#tooltip').remove();
            });

        console.log("Pie Slices Created.");

        // Add text labels to the slices
        slices.enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#fff')
            .text(d => `${d.data.label}: ${d.data.value}`);
        console.log("Text Labels Added to Pie Slices.");
    }).catch(error => {
        console.error("Error loading or parsing CSV data:", error);
    });

    const textElementId = svgSelector === 'svg-panel-1' ? 'text-panel-1' : 'text-panel-2';
    document.getElementById(textElementId).style.display = 'block';

}

// Make the function accessible globally
window.createPieChart = createPieChart;
