const xAttribute = "Attack",
        yAttribute = "Defense",
        rAttribute = "HP",
        cAttribute = "Sp. Attack"

const WIDTH = 800, 
      HEIGHT = 500;

const margin = {
    top: 70,
    bottom: 70,
    left: 100,
    right: 100
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

const svg = d3.select('#container').append('svg');

svg.attr("width", WIDTH).attr("height", HEIGHT);

const container = svg.append('g').attr("transform", 
                                          `translate(${margin.left} 
                                                     ${margin.top})`);

const scatter = (data) => {
    const xScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d) => d.base[xAttribute])])
                        .range([0, width])

    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d) => d.base[yAttribute])])
                        .range([height, 0]);

    const rScale = d3.scaleSqrt()
                        .domain([0, d3.max(data, (d) => d.base[rAttribute])])
                        .range([0, 5])
    
    const cScale = d3.scaleLinear()
                        .domain([0, d3.max(data, (d) => d.base[cAttribute])])
                        .range(['yellow', '#FF0000']);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
          .append("g")
          .attr("transform", `translate(${margin.left}, 
                                        ${HEIGHT - margin.bottom})`)
          .call(xAxis);

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
          .text(`Pokemon: ${yAttribute} vs ${xAttribute}`);

    svg.append("text")             
          .attr("transform",
                "translate(" + ((width/2) + margin.left) + " ," + 
                               (height + margin.top + margin.bottom/2) + ")")
          .style("text-anchor", "middle")
          .text(xAttribute);

    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left/2)
          .attr("x",0 - (HEIGHT / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yAttribute); 

    container
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", (d) => rScale(d.base[rAttribute]))
        .attr("fill", (d) => cScale(d.base[cAttribute]))
        .attr("cx", (d) => xScale(d.base[xAttribute]))
        .attr("cy", (d) => yScale(d.base[yAttribute]));
}

d3.json("./data/pokedex.json")
    .then((data) => {
        scatter(data);
    })
    .catch((err) => console.log(err));