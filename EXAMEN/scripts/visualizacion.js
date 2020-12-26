const WIDTH = 1200,
      HEIGHT = 180;

const TRANSLATE_LIMIT = 100;

const margin = {
    top: 50,
    bottom: 50,
    left: 80,
    right: 120,
};
const dimNotas = {
    height: 200,
    width: 200,
    marginBottom: 30
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

// const graficar = async (atributo) => {
//     const dataByGenres = await d3.csv("data/data_by_genres.csv", parser_genres);
//     let dataByYear = await d3.csv("data/data_by_year.csv", parser_year);



//     const maxValue = d3.max(dataByYear, (d) => d[atributo]);

//     // (tip: recordar que a los arrays de JS se les puede aplicar .sort )

//     dataByYear.sort((a, b) => a.year - b.year);

//     // Escala del eje X. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
//     // dominio y rango como mínimo.

//     const xScale = d3.scaleBand()
//                         .domain(dataByYear.map((d) => d.year))
//                         .range([0, width])
//                         .padding(0.3);

//     // Escala del eje Y. Debe tener, tipo de escala (scaleBand, scaleLinear, etc),
//     // dominio y rango como mínimo.

//     const yScale = d3.scaleLinear()
//                         .domain([0, maxValue])
//                         .range([height, 0]);

//     const line = d3.line() // inicialización
//                         .x((d) => xScale(d.year)) // Con esto le damos las coordenadas 'x' que tendrán los puntos por donde pasará la línea
//                         .y((d) => yScale(d[atributo])) // Con esto le damos las coordenadas 'y' que tendrán los puntos por donde pasará la línea 
//                         .curve(d3.curveMonotoneX) // Opcional. Suaviza la línea. Prueba comentándolo para ver cómo se ve sin esto.

//     // Se crean los ejes X e Y. Se les debe dar como parámetro la escala X e Y hecha previamente.
//     // Únicamente por motivos visuales, se le puede dar un formato a los ticks del eje X 
//     // (hint: .tickFormat(), investigue como darle un formato de tiempo)

//     const xAxis = d3.axisBottom(xScale)//.tickFormat(d3.timeFormat("%y-%m"))
//     const yAxis = d3.axisLeft(yScale);

//     const contenedorEjeX = svg.selectAll(".xAxis")
//         .transition()
//         .duration(1000)
//         .call(xAxis)
//         .selectAll("text")
//         .attr("transform", `rotate(45)`);

//     const contenedorEjeY = svg.selectAll(".yAxis")
//         .transition()
//         .duration(1000)
//         .call(yAxis)
//         .selectAll("line")
//         .attr("x1", width)
//         .attr("opacity", 0.2);

//     svg.selectAll(".title")
//         .text(`${atributo} vs año`);
    
//     svg.selectAll("#xLabel")            
//         .text("Año");

//     svg.selectAll("#yLabel")
//         .text(`${atributo}`); 
    

//     const linea = container.selectAll("path")
//         .data([dataByYear])
//         .join(
//           (enter) => 
//             enter
//                 .append("path") // cuando entre appendeamos un path
//                 .attr("class", "line") // le damos la clase para fines de CSS
//                 .attr("d", line) // el dato que tendrá este path es el objetivo line que se había generado más arriba.
//                 .selection(), 
//           (update) => 
//             update
//                 .transition() // avisamos que partirá con una transicion
//                 .duration(1000) // tiempo de la transicion
//                 .attr("d", line) // dato por el que se cambiará el antiguo
//                 .selection()
//         );

//     const dots = container.selectAll(".dot")
//         .data(dataByYear)
//         .join(
//             (enter) => 
//                 enter
//                     .append("circle") // Creo un circulo nuevo
//                     .attr("class", "dot") // Assign a class for styling
//                     .attr("cx", (d) => xScale(d.year) )
//                     .attr("cy", (d) => yScale(d[atributo]) )
//                     .transition()
//                     .duration(1000)
//                     .attr("r", 5)
//                     .selection(),
//             (update) =>
//                 update
//                     .transition()
//                     .duration(1000)
//                     .attr("cx", function(d) { return xScale(d.year) })
//                     .attr("cy", function(d) { return yScale(d[atributo]) })
//                     .selection()
//             ) // Ahora definimos el comportamiento de los circulos cuando entre o salga el mouse.
//         .on("mouseenter", (event, d) => {
//                 d3.select(event.currentTarget) // seleccionamos el nodo actual
//                   .transition() // avisamos transicion
//                   .duration(500) // tiempo transicion
//                   .attr("class", "selected") // cambiamos la clase. En el CSS se define otro color.
//                   .attr("r", 10); // cambiamos el radio.
//                 svg.append("text") // creamos texto
//                 .attr("id","tooltip") // con este ID para borrarlo después
//                 .attr("x", xScale(d.year)+125) // posición X, (jugar con coordenadas)
//                 .attr("y", yScale(d[atributo])+20) // posición Y, (jugar con coordenadas)
//                  .text(`${atributo}: ${d[atributo]}`);
//               }) // definimos que pasa cuando el mouse sale (revertir cambios)
//               .on("mouseleave", (event, d) => {
//                 d3.select(event.currentTarget)
//                   .transition()
//                   .duration(500)
//                   .attr("class", "dot") // devuelve la clase
//                   .attr("r", 5); // devuelve el radio
//                 d3.select("#tooltip").remove();  // Borra el texto anterior
//               });
              
//     function zoom(svg) {
//         const extent = [[0, 0], [width, height]];
      
//         svg.call(d3.zoom()
//             .scaleExtent([1, 8])
//             .translateExtent(extent)
//             .extent(extent)
//             .on("zoom", zoomed));
            
      
//         function zoomed(event) {
//             xScale.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
//             yScale.range([height - margin.bottom, margin.top].map(d => event.transform.applyY(d)));
//             container.selectAll(".dot").attr("cx", (d) => xScale(d.year) )
//                 .attr("cy", (d) => yScale(d[atributo]) )
//             line.x((d) => xScale(d.year)) // Con esto le damos las coordenadas 'x' que tendrán los puntos por donde pasará la línea
//                         .y((d) => yScale(d[atributo])) // Con esto le damos las coordenadas 'y' que tendrán los puntos por donde pasará la línea 
//                         .curve(d3.curveMonotoneX)
//             container.selectAll("path").attr("d", line) // el dato que tendrá este path es el objetivo line que se había generado más arriba.
//             svg.selectAll(".xAxis").call(xAxis);
//             svg.selectAll(".yAxis").call(yAxis);
//         }
//       }
//     // const zoom = d3.zoom()
//     //         .scaleExtent([1, 25])
//     //         .translateExtent([
//     //                     [- TRANSLATE_LIMIT, 0],
//     //                     [width + TRANSLATE_LIMIT, height]])
//     //         .on("zoom", (e) => container.attr("transform", e.transform));    
//     svg.call(zoom);
// }
// graficar('acousticness');

// const selector = d3.select('#selectContainer')
//                     .append('select')
//                     .attr('id', 'select');
// const types = ['acousticness', 'danceability', 'duration_ms',
//                 'instrumentalness', 'liveness', 'speechiness',
//                 'loudness', 'tempo', 'popularity'];
// for (i in types) {
//     // Se agrega cada opción
//     selector.append('option')
//             .attr('value', types[i])
//             .text(types[i][0].toUpperCase() + types[i].substring(1));
// }
// selector.on('change', (event) => {
//     graficar(event.target.value);
// });

const contenedorNota = d3.select('#contenedorNota').append('svg')
                            .attr('height', 150)
                            .attr('width', 400);

for(let j = 1; j<6; j++){
    contenedorNota.append('rect')
        .attr('x', 0)
        .attr('y', 20*j-10)
        .attr('fill', 'black')
        .attr('width', 100)
        .attr('height', 1)
        .attr('opacity', 0.5);
}
contenedorNota.append('rect')
    .attr('x', 19) // 34
    .attr('y', 35)
    .attr('fill', '#A885EE')
    .attr('width', 6)
    .attr('height', 65);

contenedorNota.append('rect')
    .attr('x', 58)
    .attr('y', 35)
    .attr('fill', '#FDAF16')
    .attr('width', 6)
    .attr('height', 65);

contenedorNota.append('rect')
    .attr('x', 19) 
    .attr('y', 15)
    .attr('fill', '#9FE481')
    .attr('width', 45) // 20
    .attr('height', 20);

contenedorNota.append('ellipse')
    .attr('cx', 15)
    .attr('cy', 100)
    .attr('rx', 12) // 9 
    .attr('ry', 9) // 6
    .attr('fill', '#67D0DD');

contenedorNota.append('line')
    .attr('x1', 64)
    .attr('y1', 16)
    .attr('x2', 100)
    .attr('y2', 16)
    .attr('stroke', '#C62121')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', 4)

contenedorNota.append('ellipse')
    .attr('cx', 54) // 30
    .attr('cy', 100) //60
    .attr('rx', 12) // 9 
    .attr('ry', 9) // 6
    .attr('fill', '#E5A4BE');

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 15)
    .attr('fill', '#C62121')
    .text('Popularidad (altura en el pentagrama)')
    

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 35)
    .attr('fill', '#FDAF16')
    .text('Acusticidad (alto)')

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 55)
    .attr('fill', '#9FE481')
    .text('Duración en ms (ancho)')
    
    

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 75)
    .attr('fill', '#67D0DD')
    .text('Bailabilidad (radio)')

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 95)
    .attr('fill', '#A885EE')
    .text('Valencia (alto)')

contenedorNota.append('text')
    .attr('x', 130) 
    .attr('y', 115)
    .attr('fill', '#E5A4BE')
    .text('Energía (radio)')
    
    
const contenedor = d3.select('#contenedorVis').append('svg')
                        .attr('height', HEIGHT*10)
                        .attr('width', WIDTH);


const make_notes = (data, atributo, genre_letter = null) => {
    
    let skip = 55;
    // ATRIBUTOS
    // LARGO CORCHEA -> ACOUSTICNESS
    // LARGO CORCHEA 2 -> INSTRUMENTALNESS
    // ANCHO CORCHEA -> DURATION_MS
    // PELOTITA 1 -> DANCEABILITY
    // PELOTITA 2 -> ENERGY
    // ALTURA -> POPULARITY
    

    maxDanceability = d3.max(data, (d) => d.danceability);
    maxAcousticness = d3.max(data, (d) => d.acousticness);
    maxValence = d3.max(data, (d) => d.valence);
    maxDurationms = d3.max(data, (d) => d.duration_ms);
    maxEnergy = d3.max(data, (d) => d.energy);
    maxPopularity = d3.max(data, (d) => d.popularity);

    const escalaDanceability = d3.scaleLinear()
                        .domain([0, maxDanceability])
                        .range([0, 10]);

    const escalaEnergy = d3.scaleLinear()
                        .domain([0, maxEnergy])
                        .range([0, 10]);

    const escalaAcousticness = d3.scaleLinear()
                        .domain([0, maxAcousticness])
                        .range([0, 60]);
    
    const escalaValence = d3.scaleLinear()
                        .domain([0, maxValence])
                        .range([0, 60]);

    const escalaDurationms = d3.scaleLinear()
                        .domain([0, maxDurationms])
                        .range([0, 60]);

    const escalaPopularity = d3.scaleLinear()
                        .domain([0, maxPopularity])
                        .range([50, 0]);
    
    if (genre_letter){
        skip = 40;
        data = data.filter(d => d['genres'].startsWith(genre_letter));
    }
    contenedor.attr('height', Math.ceil(data.length/10) * HEIGHT);

    contenedor.selectAll("g")
        .data(data)
        .join(
            (enter) => {
                let filas = Math.ceil(data.length/10);
                console.log(`${filas} filas`);
                // Se agregan pentagramas
                for(let i=0; i<filas;i++){
                    for(let j=1; j<6;j++){
                        contenedor.append('rect')
                                    .attr('class', 'pentagram')
                                    .attr('x', 0)
                                    .attr('y', i * HEIGHT + 15*j)
                                    .attr('width', WIDTH)
                                    .attr('height', 1)
                                    .attr('opacity', 0.5);
                    }
                }
                let glifo = enter.append("g")
                                .attr('class', 'glifo')
                                .attr('transform', (d, i) => `translate(${i%10 * WIDTH/10}, ${Math.floor(i/10) * HEIGHT})`)
                                .attr('width', dimNotas.width).attr('height', dimNotas.height);
                
                
       
                glifo.append('rect')
                    .attr('class', 'vert-izq')
                    .attr('x', 29)
                    .attr('y', (d) => escalaPopularity(d.popularity) + 25)
                    .attr('fill', 'black')
                    .attr('width', 4)
                    .attr('height', (d) => escalaValence(d.valence)); // 50

                glifo.append('rect')
                    .attr('class', 'vert-der')
                    .attr('x', (d) => escalaDurationms(d.duration_ms) + 29) // 34
                    .attr('y', (d) => escalaPopularity(d.popularity) + 25)
                    .attr('fill', 'black')
                    .attr('width', 4)
                    .attr('height', (d) => escalaAcousticness(d.acousticness));//50

                glifo.append('rect')
                    .attr('class', 'hor')
                    .attr('x', 29) 
                    .attr('y', (d) => escalaPopularity(d.popularity) + 15)
                    .attr('fill', 'black')
                    .attr('width', (d) => escalaDurationms(d.duration_ms) + 4) // 20
                    .attr('height', 11);
                
                glifo.append('ellipse')
                    .attr('class', 'ell-izq')
                    .attr('cx', 25)
                    .attr('cy', (d, i) => {
                        let pos = escalaValence(d.valence) + escalaPopularity(d.popularity) + 25;
                        // if (pos > 50){
                        //     enter.append('rect')
                        //         .attr('class', 'extra-line')
                        //         .attr('x', i%10 * WIDTH/10 + 10)
                        //         .attr('y', Math.floor(i/10) * HEIGHT + pos)
                        //         .attr('width', 30)
                        //         .attr('height', 1)
                        //         .attr('fill', 'black')
                        //         .attr('opacity', 0.5);
                        // }
                        return pos;
                    })
                    .attr('rx', (d) => escalaDanceability(d.danceability) + 3) // 9 
                    .attr('ry', (d) => escalaDanceability(d.danceability)) // 6
                    .attr('fill', 'black');

                glifo.append('ellipse')
                    .transition()
                    .duration(500)
                    .attr('class', 'ell-der')
                    .attr('cx', (d) => escalaDurationms(d.duration_ms) + 26) // 30
                    .attr('cy', (d) => escalaAcousticness(d.acousticness) + escalaPopularity(d.popularity) + 25) //60
                    .attr('rx', (d) => escalaEnergy(d.energy) + 3) // 9 
                    .attr('ry', (d) => escalaEnergy(d.energy)) // 6
                    .attr('fill', 'black');

                glifo.append('text')
                    .attr('class', 'label')
                    .attr('x', skip) 
                    .attr('y', 12)
                    .text((d) => d[atributo])
                    .attr('font-size', (d) => {
                        let texto = d[atributo];
                        if (texto.length < 10){
                            return '1rem';
                        } else if (texto.length < 15){
                            return '0.8rem';
                        } else if (texto.length < 20) {
                            return '0.6rem';
                        } else {
                            return '0.5rem';
                        }
                    });

            },
        (update) => {
            // let glifo =   update.selectAll(".glifo")
            //                     .attr("y", (d, i) => Math.floor(i/10) * HEIGHT)
            //                     .attr("x", (d, i) => i%10 * WIDTH/10)
            //                     .attr('width', dimNotas.width).attr('height', dimNotas.height);
            // let filas = Math.ceil(data.length/10);
            // console.log(filas*5);
            // contenedor.select('.pentagram')
            //     .style('display', (d, i) => {
            //         console.log(i);
            //         if (i > filas*5){
            //             console.log('entre');
            //             return 'block';
            //         } else {
            //             return 'block';
            //         }
            //     })
            
            // update.select('.extra-line')
            //     .attr('display', (d, i) => {
            //         let pos = escalaInstrumentalness(d.instrumentalness) + escalaPopularity(d.popularity) + 25;
            //             if (pos > 50){
            //                 return 'block';
            //             } else {
            //                 return 'none';
            //             }
            //     })

            update.select('.vert-izq')
                .transition()
                .duration(500)
                .attr('x', 29)
                .attr('y', (d) => escalaPopularity(d.popularity) + 25)
                .attr('fill', 'black')
                .attr('width', 4)
                .attr('height', (d) => escalaValence(d.valence))
                .selection(); // 50

            update.select('.vert-der')
                .transition()
                .duration(500)
                .attr('x', (d) => escalaDurationms(d.duration_ms) + 29) // 34
                .attr('y', (d) => escalaPopularity(d.popularity) + 25)
                .attr('fill', 'black')
                .attr('width', 4)
                .attr('height', (d) => escalaAcousticness(d.acousticness))
                .selection();//50

            update.select('.hor')
                .transition()
                .duration(500)
                .attr('x', 29) 
                .attr('y', (d) => escalaPopularity(d.popularity) + 15)
                .attr('fill', 'black')
                .attr('width', (d) => escalaDurationms(d.duration_ms) + 4) // 20
                .attr('height', 11)
                .selection();
            
            update.select('.ell-izq')
                .transition()
                .duration(500)
                .attr('cx', 25)
                .attr('cy', (d) => escalaValence(d.valence) + escalaPopularity(d.popularity) + 25)
                .attr('rx', (d) => escalaDanceability(d.danceability) + 3) // 9 
                .attr('ry', (d) => escalaDanceability(d.danceability)) // 6
                .attr('fill', 'black')
                .selection();

            update.select('.ell-der')
                .transition()
                .duration(500)
                .attr('cx', (d) => escalaDurationms(d.duration_ms) + 26) // 30
                .attr('cy', (d) => escalaAcousticness(d.acousticness) + escalaPopularity(d.popularity) + 25) //60
                .attr('rx', (d) => escalaEnergy(d.energy) + 3) // 9 
                .attr('ry', (d) => escalaEnergy(d.energy)) // 6
                .attr('fill', 'black')
                .selection();

            update.select('.label')
                .transition()
                .duration(500)
                .attr('x', skip) 
                .attr('y', 12)
                .text((d) => d[atributo])
                .attr('font-size', (d) => {
                    let texto = d[atributo];
                    if (texto.length < 10){
                        return '1rem';
                    } else if (texto.length < 15){
                        return '0.8rem';
                    } else if (texto.length < 20) {
                        return '0.6rem';
                    } else {
                        return '0.5rem';
                    }
                }).selection();
        }
        )

}


const contenedorSelectores = document.getElementById('contenedorSelectores');
const selectTipo = document.createElement('select');
let opcionGeneros = document.createElement('option');
let opcionAno = document.createElement('option');
opcionGeneros.innerHTML = 'Géneros';
opcionAno.innerHTML = 'Años';
opcionGeneros.value = 'genres';
opcionAno.value = 'year';
selectTipo.appendChild(opcionAno);
selectTipo.appendChild(opcionGeneros);

contenedorSelectores.appendChild(selectTipo);

const selectLetras = document.createElement('select');
selectLetras.disabled = true;
const letras = 'abcdefghijklmnopqrstuvwxyz';
for(let i = 0; i < letras.length; i++){
    let opcion = document.createElement('option');
    opcion.innerHTML = 'Que comiencen con ' + letras.charAt(i).toUpperCase();
    opcion.value = letras.charAt(i);
    selectLetras.appendChild(opcion);
}
contenedorSelectores.appendChild(selectLetras);

const btnAplicar = document.createElement('button');
btnAplicar.innerHTML = 'Aplicar';
contenedorSelectores.appendChild(btnAplicar);

btnAplicar.addEventListener('click', () => {
    let tipo = selectTipo.value;
    console.log(tipo);
    console.log(selectLetras.value);
    if (tipo === 'genres' & selectLetras.value !== null){
        console.log('cambio');
        d3.csv('data/data_by_genres.csv', parser_genres)
            .then((data) => {
                make_notes(data, 'genres', selectLetras.value);
                })
    } else if (tipo === 'year'){
        console.log('cambio');
        d3.csv('data/data_by_year.csv', parser_year)
            .then((data) => {
                make_notes(data, 'year');
                })
    }
})

selectTipo.addEventListener('change', (e) => {
    if (e.target.value === 'genres'){
        selectLetras.disabled = false;
    } else {
        selectLetras.disabled = true;
    }
})

// d3.csv('data/data_by_genres.csv', parser_genres)
// .then((data) => {
//     make_notes(data, 'genres', 'n');
// })
d3.csv('data/data_by_year.csv', parser_year)
.then((data) => {
    make_notes(data, 'year');
})

// // Minimo posible
// contenedorNotaMin.append('rect')
// .attr('x', 19)
// .attr('y', escalaPopularity(minPopularity) + 15)
// .attr('fill', 'black')
// .attr('width', 4)
// .attr('height', escalaInstrumentalness(minInstrumentalness)); // 50

// contenedorNotaMin.append('rect')
// .attr('x', escalaDurationms(minDurationms) + 18) // 34
// .attr('y', escalaPopularity(minPopularity) + 15)
// .attr('fill', 'black')
// .attr('width', 4)
// .attr('height', escalaAcousticness(minAcousticness));//50

// contenedorNotaMin.append('rect')
// .attr('x', 19) 
// .attr('y', escalaPopularity(minPopularity) + 15)
// .attr('fill', 'black')
// .attr('width', escalaDurationms(minDurationms)) // 20
// .attr('height', 10);

// contenedorNotaMin.append('ellipse')
// .attr('cx', 15)
// .attr('cy', escalaInstrumentalness(minInstrumentalness) + escalaPopularity(minPopularity) + 15)
// .attr('rx', escalaDanceability(minDanceability) + 3) // 9 
// .attr('ry', escalaDanceability(minDanceability)) // 6
// .attr('fill', 'black');

// contenedorNotaMin.append('ellipse')
// .attr('cx', escalaDurationms(minDurationms) + 15) // 30
// .attr('cy', escalaAcousticness(minAcousticness) + escalaPopularity(minPopularity) + 15) //60
// .attr('rx', escalaEnergy(minEnergy) + 3) // 9 
// .attr('ry', escalaEnergy(minEnergy)) // 6
// .attr('fill', 'black');

