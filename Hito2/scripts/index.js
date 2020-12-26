
// Dimensiones de tarjetas
const WIDTH = 260,
      HEIGHT = 355;

const margin = {
        top: 10,
        bottom: 10,
        left: 5,
        right: 5,
        };

const width = WIDTH - margin.left - margin.right,
        height = HEIGHT - margin.top - margin.bottom;
const rscale = height/22; //18
const contenedorTarjetas = d3.select('#contenedorTarjetas');
const skills = ['PAC', 'SHO', 'PAS', 'DRIB', 'DEF', 'PHY']
const skillNames = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const tiers = {
    gold: 'rgb(201, 176, 55)',
    silver: 'rgb(215, 215, 215)',
    bronze: 'rgb(173, 138, 86)'
}
const posiciones = {
    defensa: ['CB', 'RB', 'LB', 'LWB', 'RWB'],
    mediocampista: ['CM', 'CAM', 'CDM', 'LM', 'RM'],
    delantero: ['CF', 'ST', 'RW', 'LW', 'LF', 'RF']
}
const parser = (data) => {
    return {
        name: data.NAME,
        club: data.CLUB,
        league: data.LEAGUE,
        position: data.POSITION,
        tier: data.TIER,
        rating: parseInt(data.RATING),
        pace: parseInt(data.PACE),
        shooting: parseInt(data.SHOOTING),
        passing: parseInt(data.PASSING),
        dribbling: parseInt(data.DRIBBLING),
        defending: parseInt(data.DEFENDING),
        physical: parseInt(data.PHYSICAL)
    }
}

const posRotada = (elem) => {
    // Función encargada de entregar la posición rotada de un punto
    let factor = elem.node().getCTM(); // Por favor, no considerar ofensa. El método se llama así.
    return [
        elem.attr('cx')*factor.a + elem.attr('cy')*factor.c + factor.e,
        elem.attr('cx')*factor.b + elem.attr('cy')*factor.d + factor.f
    ]
}
// https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
// Fórmula matemática para rotar un punto en 2D
function rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

// Escala que lleva de 0-99 al rango del círculo (radio)
const escala = d3.scaleLinear()
                    .domain([1, 99])
                    .range([width/2, width/2 + rscale * 5]);

// Escalas individuales por atributo. Aplican lo anterior y una rotación
const scalePHY = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, 210);

const scaleDEF = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, 150);

const scaleDRIB = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, 90);

const scalePAS = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, 30);

const scaleSHO = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, -30);

const scalePAC = (valor) => rotate(width/2, 2/3 * height, escala(valor), 2/3 * height, 270);

// Esta función recibe datos de un jugador y los lleva a puntos de un polígono
const getPoints = (d) => {
    let strPoints = '';
    let arr_scales = [scalePAC, scaleSHO, scalePAS, scaleDRIB, scaleDEF, scalePHY];
    for (let i in arr_scales){
        strPoints += arr_scales[i](d[skillNames[i]]).join(',') + ' ';
    }
    return strPoints;
    };

const get_avgs = (data) => {
    const avg_PAC = d3.mean(data.map((d) => d.pace));
    const avg_SHO = d3.mean(data.map((d) => d.shooting));
    const avg_PAS = d3.mean(data.map((d) => d.passing));
    const avg_DRIB = d3.mean(data.map((d) => d.dribbling));
    const avg_DEF = d3.mean(data.map((d) => d.defending));
    const avg_PHY = d3.mean(data.map((d) => d.physical));
    const avg_rating = d3.mean(data.map((d) => d.rating));
    return {pace: avg_PAC, shooting: avg_SHO, 
        passing: avg_PAS, dribbling: avg_DRIB, 
        defending: avg_DEF, physical: avg_PHY,
        rating: avg_rating}
}

const dibujarCirculos = (contenedor) => {
    
    contenedor.append('circle')
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .attr('cx', width/2)
            .attr('cy', 2/3 * height)
            .attr('r', rscale * 5);        
    for(let i = 1; i < 6; i++){
        let circle = contenedor.append('circle')
            .attr('stroke', 'gray')
            .attr('fill', 'transparent')
            .attr('cx', width/2)
            .attr('cy', 2/3 * height)
            .attr('r', rscale * i);
    if (i != 5){
        for(let j = 1; j < 4; j++){
            if (j != 1){
                contenedor.append('text')
                    .attr('class', 'stats')
                    .attr('x', width/2 - 4)
                    .attr('y', 2/3 * height - rscale * i)
                    .text(20*i)
                    .attr('transform', `rotate(${120*j + 60} ${width/2} ${2/3 * height})`);
            } else {
                contenedor.append('text')
                    .attr('class', 'stats')
                    .attr('x', width/2 - 4)
                    .attr('y', 2/3 * height + rscale * i + 8)
                    .text(20*i);
            }
        }
    } else {
        for(let j = 1; j < 7; j++){
            let skill = contenedor.append('text')
                .attr('class', 'stats-black')
                .attr('x', width/2 - 8)
                .attr('y', 2/3 * height - rscale * i)
                .text(skills[j-1])
                .attr('transform', `rotate(${60*j} ${width/2} ${2/3 * height})`);
            if (j == 2){
                skill.attr('y', 2/3 * height + rscale * i + 8)
                    .attr('transform', `rotate(${-60} ${width/2} ${2/3 * height})`);
            } else if (j == 3){
                skill.attr('y', 2/3 * height + rscale * i + 8)
                    .attr('transform', `rotate( 0 ${width/2} ${2/3 * height})`);
            } else if (j == 4){
                skill.attr('y', 2/3 * height + rscale * i + 8)
                    .attr('transform', `rotate(${60} ${width/2} ${2/3 * height})`);
            }
        }
        }
    }
}

const crearTarjetas = (data) => {
    contenedorTarjetas.selectAll('div')
        .data(data)
        .join(
            (enter) => {
                let tarjeta_svg = enter.append('div')
                                        .attr('class', 'tarjeta')
                                        .style('background-color', (d) => {
                                            if (75 <= d.rating && d.rating <= 99){
                                                return tiers.gold;
                                            } else if (65 <= d.rating && d.rating < 75){
                                                return tiers.silver;
                                            } else if (1 <= d.rating && d.rating < 65){
                                                return tiers.bronze;
                                            }
                                        })
                                        .append('svg')
                                        .attr('width', WIDTH)
                                        .attr('height', HEIGHT);
                                        
                let contenedorTarjeta = tarjeta_svg.append('g')
                                        .attr('transform',
                                            `translate(${margin.left}, ${margin.top})`);
                contenedorTarjeta.append('text')
                                        .attr('class', 'rating')
                                        .attr('x', 3*margin.left)
                                        .attr('y', height/8)
                                        .text((d) => d.rating);
                contenedorTarjeta.append('text')
                                        .attr('x', width/3)
                                        .attr('y', height/12)
                                        .text((d) => d.name.split(" ")[0]);
                contenedorTarjeta.append('text')
                                        .attr('x', width/3)
                                        .attr('y', height/6)
                                        .text((d) => d.name.split(" ").slice(1,d.name.split(" ").length).join(" "));
                contenedorTarjeta.append('line')
                                        .attr('x1', width/3)
                                        .attr('y1', height/5)
                                        .attr('x2', width - margin.right)
                                        .attr('y2', height/5)
                                        .attr('stroke', 'black')
                                        .attr('stroke-width', 1);
                contenedorTarjeta.append('text')
                                        .attr('x', 4*margin.left)
                                        .attr('y', height/4)
                                        .text((d) => d.position);
                contenedorTarjeta.append('text')
                                        .attr('class', 'club')
                                        .attr('x', width/3)
                                        .attr('y', height/4 + 5)
                                        .text((d) => d.club)
                                        .attr('font-size', (d) => {
                                            if (d.club.length > 25){
                                                return '0.6rem';
                                            } else {
                                                return '0.8rem';
                                            }
                                        });
                contenedorTarjeta.append('text')
                                    .attr('class', 'league')
                                    .attr('x', width/3)
                                    .attr('y', height/3 - 5)
                                    .text((d) => d.league)
                                    .attr('font-size', (d) => {
                                        if (d.league.length > 25){
                                            return '0.6rem';
                                        } else {
                                            return '0.8rem';
                                        }
                                    });
                dibujarCirculos(contenedorTarjeta);
                // Creación del polígono
                contenedorTarjeta.append('polygon')
                                .attr('points', (d) => getPoints(d))
                                .attr('opacity', 0.5)
                                .attr('fill', (d) => {
                                    if (posiciones.defensa.includes(d.position)){
                                        return 'blue';
                                    } else if (posiciones.mediocampista.includes(d.position)){
                                        return 'green';
                                    } else if (posiciones.delantero.includes(d.position)){
                                        return 'red';
                                    }
                                });
                                                            
            }
        );
    // Evento de entrada/salida del cursor sobre una tarjeta
    contenedorTarjetas.selectAll('div')
        .on("mouseenter", (event, d) => {
                d3.selectAll('.tarjeta')
                    .style('opacity', (e) => {
                        if (e.club != d.club){
                            return 0.4;
                        };
                })
        .on("mouseleave", (event, d) => {
                    d3.selectAll('.tarjeta')
                            .style('opacity', 1)});
    });
}
const obtenerResumen = (data) => {
    const contenedorResumen = d3.select('#contenedorResumen')
                                .attr('class', 'tarjetaResumen');

    const resumen = d3.select('#contenedorResumen');
    const svg = resumen.append('svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT);
    dibujarCirculos(svg);
    let avgs = get_avgs(data);
    svg.append('text')
        .attr('class', 'rating')
        .attr('id', 'ratingResumen')
        .attr('x', 4*margin.left)
        .attr('y', height/5)
        .text(Math.round(avgs.rating));
    svg.append('text')
        .attr('x', width/3)
        .attr('y', height/6)
        .text('Resumen');
    svg.append('line')
        .attr('x1', width/3)
        .attr('y1', height/5)
        .attr('x2', width - margin.right)
        .attr('y2', height/5)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    svg.append('text')
        .attr('class', 'club')
        .attr('id', 'numTarjetas')
        .attr('x', width/3)
        .attr('y', height/4 + 5)
        .text(`Número de tarjetas: ${data.length}`)
        .attr('font-size', '0.8rem');
    svg.append('polygon')
        .attr('id', 'polygonResumen')
        .attr('points', getPoints(avgs))
        .attr('opacity', 0.5)
        .attr('fill', 'black');
}

// Filtros (bonus)
const selectFiltro = document.getElementById('selectFiltro');
let selectLiga = document.createElement('select');
let selectClub = document.createElement('select');
let optgroupLiga = document.createElement('optgroup');
let optgroupClub = document.createElement('optgroup');
let optionLiga = document.createElement('option'); 
let optionClub = document.createElement('option');
optionLiga.value = 'none';
optionLiga.innerHTML = '--Liga--';
optionClub.value = 'none';
optionClub.innerHTML = '--Club--';
optgroupClub.appendChild(optionClub);
optgroupLiga.appendChild(optionLiga);
selectLiga.appendChild(optgroupLiga);
selectClub.appendChild(optgroupClub);
selectFiltro.appendChild(selectLiga);
selectFiltro.appendChild(selectClub);


let pRatingMin = document.createElement('p');
pRatingMin.innerHTML = 'Rating Mínimo: 50';
let rangoMin = document.createElement('input');
rangoMin.type = 'range';
rangoMin.min = 1;
rangoMin.max = 99;
rangoMin.value = 50;
let pRatingMax = document.createElement('p');
pRatingMax.innerHTML = 'Rating Máximo: 50';
let rangoMax = document.createElement('input');
rangoMax.type = 'range';
rangoMax.min = 1;
rangoMax.max = 99;
rangoMax.value = 50;
selectFiltro.appendChild(pRatingMin);
selectFiltro.appendChild(rangoMin);
selectFiltro.appendChild(pRatingMax);
selectFiltro.appendChild(rangoMax);

rangoMin.addEventListener('input', (event) => {
    let valor = event.target.value;
    pRatingMin.innerHTML = `Rating Mínimo: ${event.target.value}`;
    if (valor > rangoMax.value) {
        rangoMax.value = event.target.value;
        pRatingMax.innerHTML = `Rating Máximo: ${event.target.value}`;
    }
})
rangoMax.addEventListener('input', (event) => {
    let valor = event.target.value;
    pRatingMax.innerHTML = `Rating Máximo: ${event.target.value}`;
    if (valor < rangoMin.value) {
        rangoMin.value = event.target.value;
        pRatingMin.innerHTML = `Rating Mínimo: ${event.target.value}`;
    }
})


const contenedorBotones = document.createElement('div');
contenedorBotones.setAttribute('class', 'row');
let aplicar = document.createElement('button');
aplicar.innerHTML = 'Aplicar';
let limpiar = document.createElement('button');
limpiar.innerHTML = 'Borrar filtros';
contenedorBotones.appendChild(aplicar);
contenedorBotones.appendChild(limpiar);
selectFiltro.appendChild(contenedorBotones);
aplicar.addEventListener('click', () => {
    let liga = selectLiga.value;
    let club = selectClub.value;
    let minR = rangoMin.value;
    let maxR = rangoMax.value;
    let arrayFiltrado = [];
    d3.selectAll('.tarjeta')
                    .style('display', (e) => {
                        console.log(e);
                        if ((liga != 'none' && e.league != liga)
                         || (club != 'none' && e.club != club)
                         || (e.rating < minR) || (e.rating > maxR)){
                            return 'none';
                        } else {
                            arrayFiltrado.push(e);
                            return 'block';
                        };
                        });
    let avgs = get_avgs(arrayFiltrado);
    d3.select('#polygonResumen')
        .transition()
        .duration(1000)
        .attr('points', getPoints(avgs));
    d3.select('#ratingResumen').text(() => {
        if (arrayFiltrado.length > 0){
            return Math.round(avgs.rating);
        } else {return 0};
        });
    d3.select('#numTarjetas').text(`Número de tarjetas: ${arrayFiltrado.length}`)
});
limpiar.addEventListener('click', () => {
    d3.selectAll('.tarjeta').style('display', 'block');
    selectClub.selectedIndex = 0;
    selectClub.value = 'none';
    selectLiga.selectedIndex = 0;
    selectLiga.value = 'none';
    rangoMax.value = 50;
    rangoMin.value = 50;
    pRatingMin.innerHTML = 'Rating Mínimo: 50';
    pRatingMax.innerHTML = 'Rating Máximo: 50';

})


d3.csv('data/fifa_20_data.csv', parser)
.then((data) => {

    // Se crean las tarjetas y se obtiene el resumen
    crearTarjetas(data);
    obtenerResumen(data);

    // Se agregan las opciones a cada elemento select
    // https://codeburst.io/javascript-array-distinct-5edc93501dc4
    let opcionesLiga = [...new Set(data.map((d) => d.league))];
    let opcionesClub = [...new Set(data.map((d) => d.club))];
    for (let i in opcionesLiga){
        let option = document.createElement('option');
        option.value = opcionesLiga[i];
        option.innerHTML = opcionesLiga[i]
        optgroupLiga.appendChild(option);
    }
    for (let i in opcionesClub){
        let option = document.createElement('option');
        option.value = opcionesClub[i];
        option.innerHTML = opcionesClub[i]
        optgroupClub.appendChild(option);   
    }
    
})
.catch((err) => console.log(err));
