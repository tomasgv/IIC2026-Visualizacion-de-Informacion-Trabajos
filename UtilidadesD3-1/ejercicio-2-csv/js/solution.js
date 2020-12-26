const WIDTH = 800, 
      HEIGHT = 400;

const margin = {
    top: 70,
    bottom: 70,
    right: 100,
    left: 100,
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

const svg = d3.select('#container').append('svg');

svg.attr("width", WIDTH).attr("height", HEIGHT);

const container = svg.append('g')
                        .attr("transform", `translate(${margin.left}, 
                                                      ${margin.top})`);

const parseDate = d3.timeParse("%B %Y");

const parser = (d) => {
    return {
        date: parseDate(d.date),
        value: parseInt(d.value)
    }
}

const timeBars = (data) => {
    const maxValue = d3.max(data, (d) => d.value);

    data.sort((a, b) => a.date - b.date);

    const xScale = d3.scaleBand()
                        .domain(data.map((d) => d.date))
                        .range([0, width])
                        .padding(0.3);

    const yScale = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([height, 0]);

    const heightScale = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([0, height]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b%y"))
    const yAxis = d3.axisLeft(yScale);

    svg
          .append("g")
          .attr("transform", `translate(${margin.left}, 
                                        ${HEIGHT - margin.bottom})`)
          .call(xAxis)
          .selectAll("text")
          .attr("text-anchor", "start")
          .attr("transform", `rotate(45)`)

    svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`)
          .call(yAxis)
          .selectAll("line")
          .attr("x1", width)
          .attr("stroke-dasharray", "5")
          .attr("opacity", 0.5);

    svg.append("text")             
          .attr("transform",
                "translate(" + ((width/2) + margin.left) + " ," + 
                               (margin.top/2) + ")")
          .style("text-anchor", "middle")
          .text(`Valor vs Mes`);

    svg.append("text")             
          .attr("transform",
                "translate(" + ((width/2) + margin.left) + " ," + 
                               (HEIGHT - margin.bottom/4) + ")")
          .style("text-anchor", "middle")
          .text("Mes");

    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left/2)
          .attr("x",0 - (HEIGHT / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Valor"); 

    container
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("fill", "steelblue")
        .attr("height", (d) => heightScale(d.value))
        .attr("x", (d) => xScale(d.date))
        .attr("y", (d) => yScale(d.value));
}

d3.csv("./data/data.csv", parser)
    .then((data) => {
        timeBars(data)
    })
    .catch((err) => console.log(err));