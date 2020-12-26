
const WIDTH = 400,
HEIGHT = 500;

const margin = {
top: 5,
bottom: 50,
left: 30,
right: 30,
info: 80
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

// Se define una escala para multiplicar el tamaño de pétalo y sépalo
const scale = width/15;

d3.select('#container')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

const svg = d3.select('#container')
            .append('svg')
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

const container = svg.append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Se crea un object con colores por tipo de flor
const colors = {
    'virginica': {
        petal: '#FFFFFF',
        sepal: '#6707F7'
    },
    'versicolor': {
        petal: '#C500FA',
        sepal: '#006ADB'
    },
    'setosa': {
        petal: '#7ABAFF',
        sepal: '#BC7AFF'
    }
}


// Se agrega el selector a su respectivo div
const selector = d3.select('#selectorContainer')
                    .append('select')
                    .attr('id', 'select');
const types = ['virginica', 'versicolor', 'setosa'];
for (i in types) {
    // Se agrega cada opción
    selector.append('option')
            .attr('value', types[i])
            .text(types[i][0].toUpperCase() + types[i].substring(1));
}

// Se agrega la simbología, círculos para indicar los colores y tamaños promedio de pétalo y cépalo
container.append('circle')
    .attr('id', 'circlePetal')
    .attr('cx', margin.info)
    .attr('cy', height - margin.bottom/2)
    .attr('r', width/30);
            
container.append('circle')
    .attr('id', 'circleSepal')
    .attr('cx', margin.info)
    .attr('cy', height + margin.bottom/3)
    .attr('r', width/30);

container.append('text')
    .attr('id', 'infoPetal')
    .attr('x', margin.info + width/15)
    .attr('y', height - margin.bottom/2 + width/60);
    
container.append('text')
    .attr('id', 'infoSepal')
    .attr('x', margin.info + width/15)
    .attr('y', height + margin.bottom/3 + width/60);

// Función que obtiene los atributos promedio del tipo de flor especificado
const get_avgs = (data, type) => {
    data = data.filter(item => item.species === type);
    const avg_sepalLength = d3.mean(data.map((obj) => obj.sepalLength));
    const avg_sepalWidth = d3.mean(data.map((obj) => obj.sepalWidth));
    const avg_petalLength = d3.mean(data.map((obj) => obj.petalLength));
    const avg_petalWidth = d3.mean(data.map((obj) => obj.petalWidth));
    result_sepal = {
        'type': 'sepal',
        'length': avg_sepalLength,
        'width': avg_sepalWidth
    };
    result_petal = {
        'type': 'petal',
        'length': avg_petalLength,
        'width': avg_petalWidth
    };
    return [result_sepal, result_sepal, result_sepal,
        result_petal, result_petal, result_petal];
}

// Función que dibuja el glifo
const draw_flower = (data, type) => {

    // Se llama a la función para obtener promedios
    const avgs = get_avgs(data, type);
    
    // Join personalizado!
    container
            .selectAll('ellipse')
            .data(avgs)
            .join(
                (enter) => {enter
                    .append('ellipse')
                    .attr('cx', width/2)
                    .attr('cy', height/2)
                    .attr('transform', (d, i) => {
                        if (i < 3){return `rotate(${30 + 120*i}, ${width/2}, ${height/2})`}
                        else {return `rotate(${90 + 120*i}, ${width/2}, ${height/2})`}
                    })
                    .transition()
                    .duration(1000)
                    .attr('cx', (d) => width/2 + d.length/2*scale)
                    .attr('cy', height/2)
                    .attr('fill', (d, i) => {
                        if (i < 3){return colors[type].sepal}
                        else {return colors[type].petal}
                    })
                    .attr('rx', (d) => d.length/2*scale)
                    .attr('ry', (d) => d.width/2*scale)
                    .selection();
                d3.select('#circlePetal')
                    .transition()
                    .duration(1000)
                    .attr('fill', colors[type].petal);
                d3.select('#circleSepal')
                    .transition()
                    .duration(1000)
                    .attr('fill', colors[type].sepal);
                d3.select('#infoPetal')
                    .transition()
                    .duration(1000)
                    .text(`Pétalo: ${avgs[3].length.toFixed(2)} x ${avgs[3].width.toFixed(2)} cm`);
                d3.select('#infoSepal')
                    .transition()
                    .duration(1000)
                    .text(`Sépalo: ${avgs[0].length.toFixed(2)} x ${avgs[0].width.toFixed(2)} cm`);
                container.append('circle')
                    .attr('r', width/20)
                    .attr('cx', width/2)
                    .attr('cy', height/2)
                    .attr('fill', 'yellow');
                }
                ,
                (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr('cx', (d)=> width/2 + d.length/2*scale)
                    .attr('cy', height/2)
                    .attr('fill', (d, i) => {
                        if (i < 3){return colors[type].sepal}
                        else {return colors[type].petal}
                    })
                    .attr('rx', (d) => d.length/2*scale)
                    .attr('ry', (d) => d.width/2*scale)
                    .selection();
                    d3.select('#circlePetal')
                    .transition()
                    .duration(1000)
                    .attr('fill', colors[type].petal);
                d3.select('#circleSepal')
                    .transition()
                    .duration(1000)
                    .attr('fill', colors[type].sepal);
                d3.select('#infoPetal')
                    .text(`Pétalo: ${avgs[3].length.toFixed(2)} x ${avgs[3].width.toFixed(2)} cm`);
                d3.select('#infoSepal')
                    .text(`Sépalo: ${avgs[0].length.toFixed(2)} x ${avgs[0].width.toFixed(2)} cm`);
                }
            )
    container.selectAll('ellipse')
        .on('mouseenter', (event, d) => {
            if (d.type === 'petal') {d3.select('#infoPetal').style('font-weight', 'bold')
            } else {d3.select('#infoSepal').style('font-weight', 'bold')}
            }).on('mouseleave', (event, d) => {
                if (d.type === 'petal') {d3.select('#infoPetal').style('font-weight', 'normal')
            } else {d3.select('#infoSepal').style('font-weight', 'normal')}
            });    
}


d3.json('./data/iris.json')
    .then((data) => {
        draw_flower(data, 'virginica');
        // Se agrega el evento change
        selector.on('change', (event) => {
            console.log(event.target.value);
            draw_flower(data, event.target.value);
        });
    })
    .catch((err) => console.log(err));