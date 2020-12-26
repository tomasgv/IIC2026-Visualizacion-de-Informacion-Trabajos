// Basado fuertemente en el ejercicio de las paltas

const WIDTH = 1200,
      HEIGHT = 500;

const TRANSLATE_LIMIT = 100;

const margin = {
    top: 50,
    bottom: 50,
    left: 80,
    right: 120,
};


const width = WIDTH - margin.left - margin.right,
    height = HEIGHT - margin.top - margin.bottom;

const svg = d3.select('#container')
    .append('svg')
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

const container = svg.append('g')
    .attr("transform", `translate(${margin.left}, 
                                  ${margin.top})`);

svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${margin.left}, 
    ${HEIGHT - margin.bottom})`);

svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left},
    ${margin.top})`);

svg.append("text")     
    .attr("class", "title")
    .attr("transform",
        "translate(" + ((width/2) + margin.left) + " ," + 
        (margin.top/2) + ")");

svg.append("text")  
    .attr("class", "label")
    .attr("id", "xLabel")
    .attr("transform",
        "translate(" + ((width/2) + margin.left) + " ," + 
                        (HEIGHT - margin.bottom/4) + ")");

const yLabel = svg.append("text")
                  .attr("class", "label")
                  .attr("id", "yLabel")
                  .attr("transform", "rotate(-90)")
                  .attr("y", margin.left/2)
                  .attr("x",0 - (HEIGHT / 2))
                  .attr("dy", "1em");

const parser_genres = (data) => {
    return {
        genres: data.genres,
        acousticness: parseFloat(data.acousticness),
        danceability: parseFloat(data.danceability),
        duration_ms: parseFloat(data.duration_ms),
        energy: parseFloat(data.energy),
        valence: parseFloat(data.valence),
        liveness: parseFloat(data.liveness),
        loudness: parseFloat(data.loudness),
        speechiness: parseFloat(data.speechiness),
        tempo: parseFloat(data.tempo),
        popularity: parseFloat(data.popularity)
    }
}
const parser_year = (data) => {
    return {
        year: data.year,
        acousticness: parseFloat(data.acousticness),
        danceability: parseFloat(data.danceability),
        duration_ms: parseFloat(data.duration_ms),
        energy: parseFloat(data.energy),
        valence: parseFloat(data.valence),
        liveness: parseFloat(data.liveness),
        loudness: parseFloat(data.loudness),
        speechiness: parseFloat(data.speechiness),
        tempo: parseFloat(data.tempo),
        popularity: parseFloat(data.popularity)
    }
}

const graficar = async (atributo) => {
    const dataByGenres = await d3.csv("data/data_by_genres.csv", parser_genres);
    let dataByYear = await d3.csv("data/data_by_year.csv", parser_year);



    const maxValue = d3.max(dataByYear, (d) => d[atributo]);

    dataByYear.sort((a, b) => a.year - b.year);


    const xScale = d3.scaleBand()
                        .domain(dataByYear.map((d) => d.year))
                        .range([0, width])
                        .padding(0.3);

    // Escala del eje Y. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
    // dominio y rango como mínimo.

    const yScale = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([height, 0]);

    const line = d3.line() 
                        .x((d) => xScale(d.year)) // Con esto le damos las coordenadas 'x' que tendrán los puntos por donde pasará la línea
                        .y((d) => yScale(d[atributo])) // Con esto le damos las coordenadas 'y' que tendrán los puntos por donde pasará la línea 
                        .curve(d3.curveMonotoneX) // Opcional. Suaviza la línea. Prueba comentándolo para ver cómo se ve sin esto.


    const xAxis = d3.axisBottom(xScale)//.tickFormat(d3.timeFormat("%y-%m"))
    const yAxis = d3.axisLeft(yScale);

    const contenedorEjeX = svg.selectAll(".xAxis")
        .transition()
        .duration(1000)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", `rotate(45)`);

    const contenedorEjeY = svg.selectAll(".yAxis")
        .transition()
        .duration(1000)
        .call(yAxis)
        .selectAll("line")
        .attr("x1", width)
        .attr("opacity", 0.2);

    svg.selectAll(".title")
        .text(`${atributo} vs año`);
    
    svg.selectAll("#xLabel")            
        .text("Año");

    svg.selectAll("#yLabel")
        .text(`${atributo}`); 
    

    const linea = container.selectAll("path")
        .data([dataByYear])
        .join(
          (enter) => 
            enter
                .append("path") 
                .attr("class", "line") 
                .attr("d", line)
                .selection(), 
          (update) => 
            update
                .transition() 
                .duration(1000) 
                .attr("d", line) 
                .selection()
        );

    const dots = container.selectAll(".dot")
        .data(dataByYear)
        .join(
            (enter) => 
                enter
                    .append("circle") 
                    .attr("class", "dot") 
                    .attr("cx", (d) => xScale(d.year) )
                    .attr("cy", (d) => yScale(d[atributo]) )
                    .transition()
                    .duration(1000)
                    .attr("r", 5)
                    .selection(),
            (update) =>
                update
                    .transition()
                    .duration(1000)
                    .attr("cx", function(d) { return xScale(d.year) })
                    .attr("cy", function(d) { return yScale(d[atributo]) })
                    .selection()
            ) 
        .on("mouseenter", (event, d) => {
                d3.select(event.currentTarget) 
                  .transition() 
                  .duration(500) 
                  .attr("class", "selected") 
                  .attr("r", 10);
                svg.append("text") 
                .attr("id","tooltip") 
                .attr("x", xScale(d.year)+125) 
                .attr("y", yScale(d[atributo])+20) 
                 .text(`${atributo}: ${d[atributo]}`);
              }) 
              .on("mouseleave", (event, d) => {
                d3.select(event.currentTarget)
                  .transition()
                  .duration(500)
                  .attr("class", "dot") 
                  .attr("r", 5);
                d3.select("#tooltip").remove(); 
              });
              
    function zoom(svg) {
        const extent = [[0, 0], [width, height]];
      
        svg.call(d3.zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));
            
      
        function zoomed(event) {
            xScale.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
            yScale.range([height - margin.bottom, margin.top].map(d => event.transform.applyY(d)));
            container.selectAll(".dot").attr("cx", (d) => xScale(d.year) )
                .attr("cy", (d) => yScale(d[atributo]) )
            line.x((d) => xScale(d.year)) // Con esto le damos las coordenadas 'x' que tendrán los puntos por donde pasará la línea
                        .y((d) => yScale(d[atributo])) // Con esto le damos las coordenadas 'y' que tendrán los puntos por donde pasará la línea 
                        .curve(d3.curveMonotoneX)
            container.selectAll("path").attr("d", line) // el dato que tendrá este path es el objetivo line que se había generado más arriba.
            svg.selectAll(".xAxis").call(xAxis);
            svg.selectAll(".yAxis").call(yAxis);
        }
      }
    // const zoom = d3.zoom()
    //         .scaleExtent([1, 25])
    //         .translateExtent([
    //                     [- TRANSLATE_LIMIT, 0],
    //                     [width + TRANSLATE_LIMIT, height]])
    //         .on("zoom", (e) => container.attr("transform", e.transform));    
    svg.call(zoom);
}
graficar('acousticness');

const selector = d3.select('#selectContainer')
                    .append('select')
                    .attr('id', 'select');
const types = ['acousticness', 'danceability', 'duration_ms',
                'valence', 'liveness', 'speechiness',
                'loudness', 'tempo', 'popularity'];
for (i in types) {
    // Se agrega cada opción
    selector.append('option')
            .attr('value', types[i])
            .text(types[i][0].toUpperCase() + types[i].substring(1));
}
selector.on('change', (event) => {
    graficar(event.target.value);
});