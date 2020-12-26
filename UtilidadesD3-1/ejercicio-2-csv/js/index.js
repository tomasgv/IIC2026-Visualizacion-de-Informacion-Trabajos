// Cuando se trabaja con CSV, el dataset se interpreta como que cada fila es un 
// dato cuyos atributos son las columnas. Podemos notar, además, que el CSV no 
// está ordenado, por lo que en alguna parte de nuestro código debemos ordenarlo.


// 1. Definir alto y ancho de nuestro SVG

const WIDTH = 0, // cambiar 
      HEIGHT = 0; // cambiar

// 2. Definir margenes, alto y ancho del contenedor

const margin = {
    // Completar
};

const width = WIDTH - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

// Seleccionamos el div correspondiente en el HTML y agregar nuestro contenedor 
// SVG (Nota: el div tiene id = #container)

const svg = d3.select('#container').append('svg');

// Ajustamos el SVG a las medidas anteriormente especificadas

svg.attr("width", WIDTH).attr("height", HEIGHT);

// 5. Agregar el contenedor que tendrá los círculos, y trasladarlo.

const container = svg.append('g').attr(
    // completar (traslado)
);

// Si revisamos el dataset, nos podemos percatar que tiene dos columnas: 
// una corresponde a un número (value) y otra a una fecha (month-year). 
// Como se vió en clases, un archivo csv trae todo su contenido en formato de 
// TEXTO, por lo que es necesario transformar los tipos de datos. Esto se llama 
// PARSEO, y para ello vamos a crear una función que tome un dato (fila) del csv
// y retorne un dato con el tipo correcto.

// En el caso de las fechas, D3 nos entrega la utilidad timeParse, la cual es 
// una función que transforma un texto en un formato especificado, en el tipo 
// Date de JavaScript. Para saber cómo utilizar este método pueden revisar el 
// siguiente link: https://github.com/d3/d3-time-format. En este caso el formato
// es "Mes Año", lo que se especifica de la forma "%B %Y". 
// (ver https://github.com/d3/d3-time-format#locale_format)

const parseDate = d3.timeParse("%B %Y");

// 6. Función de parseo
const parser = (d) => {
    // Este parser retorna un objeto con dos datos en el formato correcto
    // Para ints (enteros) deben utilizar el método parseInt de Javascript. 
    // En caso de que fuera un decimal, usaríamos parseFloat
    return {
        // date: completar,
        // value: completar
    }
}

// Cómo dijimos anteriormente, para este ejercicio haremos una gráfico de barras
// simple igual al visto en clases. Para esto crearemos una función llamada 
// timeBars que toma los datos (ya abiertos y parseados) y renderea nuestro 
// gráfico de barras

// 7. Función que genera barras

const timeBars = (data) => {
// 7.1. Lo primero que queremos hacer, es ver los rangos en los que están nuestros datos. 
//    Para esto utilizamos las siguientes utilidades: 
//          d3.max(..., ...); d3.min(..., ...); d3.extent(..., ...).
//    nota: Para ciertos tipos de datos es mejor una que la otra... ¿Por qué?
    const maxValue = d3.max(data, (d) => d.value);

// 7.2  Ordenamos los datos en orden creciente. 
//    Es importante destacar que esto es posible SOLO porque parseamos las 
//    fechas al formato Date, de lo contrario se ordenaría alfabéticamente
    data.sort((a, b) => a.date - b.date);

// 7.3 Escalas
//    Teniendo los dominios, creemos nuestras escalas con utilidades de D3!
//    Para los valores necesitamos una escala linear, la cual D3 nos proporciona
//    con el método scaleLinear. Para la fecha, en este caso la trataremos como 
//    un atributo categórico que ya está ordenado (7.2)

// 7.3.1 Escala eje X
//    Al hacer un gráfico de barras, utilizamos la utilidad scaleBand para el 
//    eje que representa la base de las barras. Esto es porque esta escala nos 
//    posiciona ordenadamente las barras, además de permitir especificar un 
//    padding entre barras. El dominio corresponde a TODAS las posibles fechas 
//    que hay ordenadas, es decir, le debemos pasar una lista con todas las 
//    fechas. hint: revisar uso de d3.map() El rango es ancho del contenedor
    const xScale = d3.scaleBand()
                        .domain(
                            // Completas
                        )
                        .range(
                            // Completar
                        )
                        .padding(0.3);

// Tenemos que llamar el método axisBottom para creat la base del eje.
// En este caso, agregamos ".tickFormat(d3.timeFormat("%b%y"))". 
// Esto hace que por ejemplo September 2019 salga de la forma Sep19.
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b%y"))

// Por último agregamos el eje al SVG. La razón por la que formateamos los ticks
// antes, es la misma por la cual ahora agregamos lo siguiente: 
// .selectAll("text").attr("text-anchor", "start").attr("transform", `rotate(45)`)
// Cuando trabajamos con ejes con nombres largos (como fechas), sirve usar 
// abreviaciones y/o rotar ligeramente el texto para evitar una superposición 
// entre distintos ticks.
    svg
          .append("g")
          .attr("transform", 
                // Completar
          )
          .call(
              // Completar
          )
          .selectAll("text")
          .attr("text-anchor", "start")
          .attr("transform", `rotate(45)`)

// 7.3.2 Escala eje Y
//    La escala Y será utilizado para determinarel punto dónde comenzará cada 
//    barra. Ya que los pixeles crecen hacia abajo en Y, debemos hacer que 
//    mientras el valor aumente, el valor de posición y disminuya
    const yScale = d3.scaleLinear()
                        .domain(
                            // Completar
                        )
                        .range(
                            // Completar
                        );
    
    // El eje Y se llama al igual que en casos anteriores
    const yAxis = d3.axisLeft(yScale);

    svg
        .append("g")
        .attr("transform", 
            // Completar
        )
        .call(
            // Completar
        )
        // También agregaremos una linea horizontal en cada tick
        .selectAll("line")
        .attr("x1", width)
        .attr("stroke-dasharray", "5")
        .attr("opacity", 0.5);

// 7.3.3 Escala de altura
//    La escala de altura será para hacer un mapeo de a cuantos pixeles de 
//    nuestro contenedor corresponde el valor de nuestro dato. Ya que se habla 
//    de cantidad, el valor al que mapea debe ser proporcional y en el mismo 
//    sentido que el del valor.

    const heightScale = d3.scaleLinear()
                        .domain(
                            // Completar
                        )
                        .range(
                            // Completar
                        );

    // Agregamos título al gráfico y nombre de los ejes
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

    // 7.4 Hacemos el data join e insertamos los rectángulos a nuestro container
    container
        .selectAll("rect")
        .data(data)
        .join("rect")
        // El ancho está dado por la escala de x, ¿recuerdas la función?
        .attr("width", 
            // Completar
        )
        // Puedes probar cambiando el color, ya sea por nombre o un hex (#123456)
        .attr("fill", "steelblue") 
        // Llamar la escala correspondiente para cada uno de los siguientes atributos
        .attr("height" 
            // Completar
        )
        .attr("x" 
            // Completar
        )
        .attr("y", 
            // Completar
        );
}

// 8. Abrir archivo, parsear, y llamar a la función para generar las barras
//    Con nuestra función de parseo lista, podemos abrir nuestro archivo para 
//    trabajar sobre el. Para esto utilizaremos la utilidad d3.csv(...). 
//    Recordemos que esta función retorna una PROMESA, por lo que debemos
//    concatenarla con then y catch.

d3.csv(
        // Completar
    )
    .then((data) => {
        // Completar
    })
    .catch((err) => console.log(err));